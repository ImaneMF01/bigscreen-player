import Squire from 'squire';
import Sinon from 'sinon';
import ManifestLoader from 'bigscreenplayer/manifest/manifestloader';
import TransferFormats from 'bigscreenplayer/models/transferformats';
    

    describe('Manifest Loader', () => {
      var loadUrl;
      var mockedLoader;

      beforeEach(done => {
        var injector = new Squire();
        loadUrl = jasmine.createSpy('loadUrl');
        injector.mock({
          'bigscreenplayer/utils/loadurl': loadUrl
        });
        injector.require(['bigscreenplayer/manifest/manifestloader'], function (ManifestLoader) {
          mockedLoader = ManifestLoader;
          done();
        });
      });

      afterEach(() => {
        loadUrl.calls.reset();
      });

      describe('With HLS media', () => {
        it('Retrieves a matched HLS url', () => {
          var url = 'hlsurl.m3u8';
          mockedLoader.load(url, undefined, {});

          expect(loadUrl).toHaveBeenCalledWith(url, jasmine.anything());
        });
      });

      describe('With Dash Media', () => {
        it('Retrieves a matched DASH url', () => {
          var url = 'dashurl.mpd';
          mockedLoader.load(url, undefined, {});

          expect(loadUrl).toHaveBeenCalledWith(url, jasmine.anything());
        });
      });

      describe('With neither Dash or HLS', () => {
        it('Calls error when no hls urls found', () => {
          var callbackSpies = {
            onError: jasmine.createSpy('error callback')
          };
          var url = 'bad_url';
          mockedLoader.load(url, undefined, callbackSpies);

          expect(callbackSpies.onError).toHaveBeenCalledWith('Invalid media url');
        });
      });

      describe('On manifestDataSource load', () => {
        var callbackSpies, server;

        var dashResponse = '<?xml version="1.0" encoding="utf-8"?> <MPD xmlns="urn:mpeg:dash:schema:mpd:2011"></MPD>';
        var hlsMasterResponse = '#EXTM3U\n' +
          '#EXT-X-VERSION:2\n' +
          '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=2255680,CODECS="mp4a.40.2,avc1.100.31",RESOLUTION=1024x576\n' +
          'live.m3u8\n' +
          '#EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=433540,CODECS="mp4a.40.2,avc1.66.30",RESOLUTION=384x216\n' +
          'bar.m3u8\n';
        var hlsLiveResponse = 'hls live playlist';
        var hlsInvalidResponse = '#EXTM3U\n' +
          '#EXT-X-VERSION:2\n';

        beforeEach(() => {
          server = Sinon.fakeServer.create();

          callbackSpies = {
            onSuccess: jasmine.createSpy('success callback'),
            onError: jasmine.createSpy('error callback')
          };
        });

        afterEach(() => {
          server.restore();
        });

        describe('DASH manifest fetching', () => {
          it('Calls success when network returns a DASH response', () => {
            server.respondWith('GET', 'http://foo.bar/test.mpd', [200, { 'Content-Type': 'application/dash+xml' }, dashResponse]);
            ManifestLoader.load('http://foo.bar/test.mpd', undefined, callbackSpies);
            server.respond();

            var expectedResponse = {
              transferFormat: TransferFormats.DASH,
              time: jasmine.any(Object)
            };

            expect(callbackSpies.onSuccess).toHaveBeenCalledWith(expectedResponse);
          });

          it('Calls error when response is invalid', () => {
            server.respondWith('GET', 'http://foo.bar/test.mpd', [200, {}, '']);
            ManifestLoader.load('http://foo.bar/test.mpd', undefined, callbackSpies);
            server.respond();

            expect(callbackSpies.onError).toHaveBeenCalledWith('Unable to retrieve DASH XML response');
          });

          it('Calls error when network request fails', () => {
            server.respondWith('GET', 'http://foo.bar/test.mpd', [404, {}, '']);
            ManifestLoader.load('http://foo.bar/test.mpd', undefined, callbackSpies);
            server.respond();

            expect(callbackSpies.onError).toHaveBeenCalledWith('Network error: Unable to retrieve DASH manifest');
          });
        });

        describe('HLS manifest fetching', () => {
          it('Calls success when network returns a HLS live playlist response', () => {
            server.respondWith('GET', 'http://foo.bar/test.m3u8', [200, { 'Content-Type': 'application/vnd.apple.mpegurl' }, hlsMasterResponse]);
            server.respondWith('GET', 'http://foo.bar/live.m3u8', [200, { 'Content-Type': 'application/vnd.apple.mpegurl' }, hlsLiveResponse]);
            ManifestLoader.load('http://foo.bar/test.m3u8', undefined, callbackSpies);
            server.respond();
            server.respond(); // need to respond twice, once for each unique url (above)

            var expectedResponse = {
              transferFormat: TransferFormats.HLS,
              time: jasmine.any(Object)
            };

            expect(callbackSpies.onSuccess).toHaveBeenCalledWith(expectedResponse);
          });

          it('calls error when network request fails', () => {
            server.respondWith('GET', 'http://foo.bar/test.m3u8', [404, { 'Content-Type': 'application/vnd.apple.mpegurl' }, '']);
            ManifestLoader.load('http://foo.bar/test.m3u8', undefined, callbackSpies);
            server.respond();

            expect(callbackSpies.onError).toHaveBeenCalledWith('Network error: Unable to retrieve HLS master playlist');
          });

          it('calls error if not valid HLS response', () => {
            server.respondWith('GET', 'http://foo.bar/test.m3u8', [200, { 'Content-Type': 'application/vnd.apple.mpegurl' }, hlsInvalidResponse]);
            ManifestLoader.load('http://foo.bar/test.m3u8', undefined, callbackSpies);
            server.respond();

            expect(callbackSpies.onError).toHaveBeenCalledWith('Unable to retrieve HLS master playlist');
          });

          it('calls error when HLS live playlist response is invalid', () => {
            server.respondWith('GET', 'http://foo.bar/test.m3u8', [200, { 'Content-Type': 'application/vnd.apple.mpegurl' }, hlsMasterResponse]);
            server.respondWith('GET', 'http://foo.bar/live.m3u8', [200, { 'Content-Type': 'application/vnd.apple.mpegurl' }, '']);
            ManifestLoader.load('http://foo.bar/test.m3u8', undefined, callbackSpies);
            server.respond();
            server.respond(); // need to respond twice, once for each unique url (above)

            expect(callbackSpies.onError).toHaveBeenCalledWith('Unable to retrieve HLS live playlist');
          });

          it('calls error when network request for HLS live playlist fails', () => {
            server.respondWith('GET', 'http://foo.bar/test.m3u8', [200, { 'Content-Type': 'application/vnd.apple.mpegurl' }, hlsMasterResponse]);
            server.respondWith('GET', 'http://foo.bar/live.m3u8', [404, { 'Content-Type': 'application/vnd.apple.mpegurl' }, '']);
            ManifestLoader.load('http://foo.bar/test.m3u8', undefined, callbackSpies);
            server.respond();
            server.respond(); // need to respond twice, once for each unique url (above)

            expect(callbackSpies.onError).toHaveBeenCalledWith('Network error: Unable to retrieve HLS live playlist');
          });
        });
      });
    });
  
