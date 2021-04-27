import MediaPlayerBase from 'bigscreenplayer/playbackstrategy/modifiers/mediaplayerbase';
import RestartableMediaPlayer from 'bigscreenplayer/playbackstrategy/modifiers/live/restartable';
import WindowTypes from 'bigscreenplayer/models/windowtypes';
    var sourceContainer = document.createElement('div');
    var player;
    var restartableMediaPlayer;
    var testTime = {
      windowStartTime: 0,
      windowEndTime: 100000,
      correction: 0
    };

    var mockMediaSources = {
      time: function () {
        return testTime;
      },
      refresh: function (successCallback, errorCallback) {
        successCallback();
      }
    };

    function initialiseRestartableMediaPlayer (windowType) {
      windowType = windowType || WindowTypes.SLIDING;
      restartableMediaPlayer = RestartableMediaPlayer(player, windowType, mockMediaSources);
    }

    describe('restartable HMTL5 Live Player', () => {
      function wrapperTests (action, expectedReturn) {
        if (expectedReturn) {
          player[action].and.returnValue(expectedReturn);

          expect(restartableMediaPlayer[action]()).toBe(expectedReturn);
        } else {
          restartableMediaPlayer[action]();

          expect(player[action]).toHaveBeenCalledTimes(1);
        }
      }

      beforeEach(() => {
        player = jasmine.createSpyObj('player',
          ['beginPlayback', 'initialiseMedia', 'stop', 'reset', 'getState', 'getSource', 'getMimeType',
            'addEventCallback', 'removeEventCallback', 'removeAllEventCallbacks', 'getPlayerElement', 'pause',
            'resume', 'beginPlaybackFrom']);
      });

      describe('methods call the appropriate media player methods', () => {
        beforeEach(() => {
          initialiseRestartableMediaPlayer();
        });

        it('calls beginPlayback on the media player', () => {
          wrapperTests('beginPlayback');
        });

        it('calls initialiseMedia on the media player', () => {
          wrapperTests('initialiseMedia');
        });

        it('calls stop on the media player', () => {
          wrapperTests('stop');
        });

        it('calls reset on the media player', () => {
          wrapperTests('reset');
        });

        it('calls getState on the media player', () => {
          wrapperTests('getState', 'thisState');
        });

        it('calls getSource on the media player', () => {
          wrapperTests('getSource', 'thisSource');
        });

        it('calls getMimeType on the media player', () => {
          wrapperTests('getMimeType', 'thisMimeType');
        });

        it('calls addEventCallback on the media player', () => {
          var thisArg = 'arg';
          var callback = function () { return; };
          restartableMediaPlayer.addEventCallback(thisArg, callback);

          expect(player.addEventCallback).toHaveBeenCalledWith(thisArg, jasmine.any(Function));
        });

        it('calls removeEventCallback on the media player', () => {
          var thisArg = 'arg';
          var callback = function () { return; };
          restartableMediaPlayer.addEventCallback(thisArg, callback);
          restartableMediaPlayer.removeEventCallback(thisArg, callback);

          expect(player.removeEventCallback).toHaveBeenCalledWith(thisArg, jasmine.any(Function));
        });

        it('calls removeAllEventCallbacks on the media player', () => {
          wrapperTests('removeAllEventCallbacks');
        });

        it('calls getPlayerElement on the media player', () => {
          wrapperTests('getPlayerElement', 'thisPlayerElement');
        });

        it('calls pause on the media player', () => {
          wrapperTests('pause');
        });
      });

      describe('should not have methods for', () => {
        function isUndefined (action) {
          expect(restartableMediaPlayer[action]).not.toBeDefined();
        }

        beforeEach(() => {
          initialiseRestartableMediaPlayer();
        });

        it('playFrom', () => {
          isUndefined('playFrom');
        });
      });

      describe('should use fake time for', () => {
        var timeUpdates = [];
        function timeUpdate (opts) {
          timeUpdates.forEach(function (fn) { fn(opts); });
        }

        beforeEach(() => {
          jasmine.clock().install();
          jasmine.clock().mockDate();

          player.addEventCallback.and.callFake(function (self, callback) {
            timeUpdates.push(callback);
          });

          initialiseRestartableMediaPlayer();
        });

        afterEach(() => {
          jasmine.clock().uninstall();
        });

        describe('getCurrentTime', () => {
          it('should be set on to the window length on beginPlayback', () => {
            restartableMediaPlayer.beginPlayback();

            expect(restartableMediaPlayer.getCurrentTime()).toBe(100);
          });

          it('should start at supplied time', () => {
            restartableMediaPlayer.beginPlaybackFrom(10);

            expect(restartableMediaPlayer.getCurrentTime()).toBe(10);
          });

          it('should increase when playing', () => {
            restartableMediaPlayer.beginPlaybackFrom(10);

            timeUpdate({ state: MediaPlayerBase.STATE.PLAYING });

            jasmine.clock().tick(1000);

            timeUpdate({ state: MediaPlayerBase.STATE.PLAYING });

            expect(restartableMediaPlayer.getCurrentTime()).toBe(11);
          });

          it('should not increase when paused', () => {
            restartableMediaPlayer.beginPlaybackFrom(10);
            timeUpdate({ state: MediaPlayerBase.STATE.PAUSED });

            jasmine.clock().tick(1000);

            timeUpdate({ state: MediaPlayerBase.STATE.PLAYING });

            expect(restartableMediaPlayer.getCurrentTime()).toBe(10);
          });
        });

        describe('getSeekableRange', () => {
          it('should start at the window time', () => {
            restartableMediaPlayer.beginPlaybackFrom(0);

            timeUpdate({ state: MediaPlayerBase.STATE.PLAYING });

            expect(restartableMediaPlayer.getSeekableRange()).toEqual({ start: 0, end: 100 });
          });

          it('should increase start and end for a sliding window', () => {
            restartableMediaPlayer.beginPlaybackFrom(0);

            timeUpdate({ state: MediaPlayerBase.STATE.PLAYING });

            jasmine.clock().tick(1000);

            expect(restartableMediaPlayer.getSeekableRange()).toEqual({ start: 1, end: 101 });
          });

          it('should only increase end for a growing window', () => {
            initialiseRestartableMediaPlayer(WindowTypes.GROWING);
            restartableMediaPlayer.beginPlaybackFrom(0);
            timeUpdate({ state: MediaPlayerBase.STATE.PLAYING });
            jasmine.clock().tick(1000);

            expect(restartableMediaPlayer.getSeekableRange()).toEqual({ start: 0, end: 101 });
          });
        });
      });

      describe('calls the mediaplayer with the correct media Type', () => {
        beforeEach(() => {
          initialiseRestartableMediaPlayer();
        });

        it('for static video', () => {
          restartableMediaPlayer.initialiseMedia(MediaPlayerBase.TYPE.VIDEO, '', '', sourceContainer);

          expect(player.initialiseMedia).toHaveBeenCalledWith(MediaPlayerBase.TYPE.LIVE_VIDEO, '', '', sourceContainer, undefined);
        });

        it('for live video', () => {
          restartableMediaPlayer.initialiseMedia(MediaPlayerBase.TYPE.LIVE_VIDEO, '', '', sourceContainer);

          expect(player.initialiseMedia).toHaveBeenCalledWith(MediaPlayerBase.TYPE.LIVE_VIDEO, '', '', sourceContainer, undefined);
        });

        it('for static audio', () => {
          restartableMediaPlayer.initialiseMedia(MediaPlayerBase.TYPE.AUDIO, '', '', sourceContainer);

          expect(player.initialiseMedia).toHaveBeenCalledWith(MediaPlayerBase.TYPE.LIVE_AUDIO, '', '', sourceContainer, undefined);
        });
      });

      describe('Restartable features', () => {
        afterEach(() => {
          delete window.bigscreenPlayer.overrides;
        });

        it('begins playback with the desired offset', () => {
          initialiseRestartableMediaPlayer();
          var offset = 10;

          restartableMediaPlayer.beginPlaybackFrom(offset);

          expect(player.beginPlaybackFrom).toHaveBeenCalledWith(offset);
        });

        it('should respect config forcing playback from the end of the window', () => {
          window.bigscreenPlayer.overrides = {
            forceBeginPlaybackToEndOfWindow: true
          };

          initialiseRestartableMediaPlayer();

          restartableMediaPlayer.beginPlayback();

          expect(player.beginPlaybackFrom).toHaveBeenCalledWith(Infinity);
        });
      });

      describe('Pausing and Auto-Resume', () => {
        var mockCallback = [];

        function startPlaybackAndPause (startTime, disableAutoResume, windowType) {
          initialiseRestartableMediaPlayer(windowType);

          restartableMediaPlayer.beginPlaybackFrom(startTime);

          for (var index = 0; index < mockCallback.length; index++) {
            mockCallback[index]({state: MediaPlayerBase.STATE.PLAYING});
          }

          restartableMediaPlayer.pause({disableAutoResume: disableAutoResume});

          for (index = 0; index < mockCallback.length; index++) {
            mockCallback[index]({state: MediaPlayerBase.STATE.PAUSED});
          }
        }

        beforeEach(() => {
          jasmine.clock().install();
          jasmine.clock().mockDate();

          player.addEventCallback.and.callFake(function (self, callback) {
            mockCallback.push(callback);
          });
        });

        afterEach(() => {
          jasmine.clock().uninstall();
          mockCallback = [];
        });

        it('calls resume when approaching the start of the buffer', () => {
          startPlaybackAndPause(20, false);

          jasmine.clock().tick(12 * 1000);

          expect(player.resume).toHaveBeenCalledWith();
        });

        it('does not call resume when approaching the start of the buffer with the disableAutoResume option', () => {
          startPlaybackAndPause(20, true);

          jasmine.clock().tick(12 * 1000);

          expect(player.resume).not.toHaveBeenCalledWith();
        });

        it('does not call resume if paused after the autoresume point', () => {
          startPlaybackAndPause(20, false);

          jasmine.clock().tick(11 * 1000);

          expect(player.resume).not.toHaveBeenCalledWith();
        });

        it('does not auto-resume if the video is no longer paused', () => {
          startPlaybackAndPause(20, false);

          for (var index = 0; index < mockCallback.length; index++) {
            mockCallback[index]({state: MediaPlayerBase.STATE.PLAYING});
          }

          jasmine.clock().tick(12 * 1000);

          expect(player.resume).not.toHaveBeenCalledTimes(2);
        });

        it('Calls resume when paused is called multiple times', () => {
          startPlaybackAndPause(0, false);

          var event = {state: MediaPlayerBase.STATE.PLAYING, currentTime: 25};
          for (var index = 0; index < mockCallback.length; index++) {
            mockCallback[index](event);
          }

          restartableMediaPlayer.pause();

          event.currentTime = 30;
          for (index = 0; index < mockCallback.length; index++) {
            mockCallback[index](event);
          }

          restartableMediaPlayer.pause();
          // uses real time to determine pause intervals
          // if debugging the time to the buffer will be decreased by the time spent.
          jasmine.clock().tick(22 * 1000);

          expect(player.resume).toHaveBeenCalledTimes(1);
        });

        it('calls auto-resume immeditetly if paused after an autoresume', () => {
          startPlaybackAndPause(20, false);

          jasmine.clock().tick(12 * 1000);

          restartableMediaPlayer.pause();

          jasmine.clock().tick(1);

          expect(player.resume).toHaveBeenCalledTimes(2);
        });

        it('auto-resume is not cancelled by a paused event state', () => {
          startPlaybackAndPause(20, false);

          for (var index = 0; index < mockCallback.length; index++) {
            mockCallback[index]({state: MediaPlayerBase.STATE.PAUSED});
          }

          jasmine.clock().tick(12 * 1000);

          expect(player.resume).toHaveBeenCalledTimes(1);
        });

        it('will fake pause if attempting to pause at the start of playback ', () => {
          startPlaybackAndPause(0, false);

          jasmine.clock().tick(1);

          expect(player.pause).toHaveBeenCalledTimes(1);
          expect(player.resume).toHaveBeenCalledTimes(1);
        });

        it('does not calls autoresume immeditetly if paused after an auto-resume with disableAutoResume options', () => {
          startPlaybackAndPause(20, true);

          jasmine.clock().tick(12 * 1000);

          jasmine.clock().tick(1);

          expect(player.resume).not.toHaveBeenCalledTimes(1);
        });

        it('time spend buffering is deducted when considering time to auto-resume', () => {
          startPlaybackAndPause();

          restartableMediaPlayer.beginPlaybackFrom(20);

          for (var index = 0; index < mockCallback.length; index++) {
            mockCallback[index]({state: MediaPlayerBase.STATE.BUFFERING, currentTime: 20});
          }

          jasmine.clock().tick(11 * 1000);

          for (index = 0; index < mockCallback.length; index++) {
            mockCallback[index]({state: MediaPlayerBase.STATE.PLAYING, currentTime: 20});
          }

          restartableMediaPlayer.pause();

          jasmine.clock().tick(3 * 1000);

          expect(player.resume).toHaveBeenCalledTimes(1);
        });

        it('Should not start auto resume timeout if window type is not SLIDING', () => {
          startPlaybackAndPause(20, false, WindowTypes.GROWING);

          jasmine.clock().tick(12 * 1000);

          expect(player.resume).not.toHaveBeenCalled();
        });
      });
    });
  
