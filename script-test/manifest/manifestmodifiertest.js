require(
  [
    'bigscreenplayer/manifest/manifestmodifier'
  ],
  function (ManifestModifier) {
    describe('ManifestModifier', function () {
      describe('filter()', function () {
        var manifest;

        beforeEach(function () {
          manifest = {
            Period: {
              AdaptationSet: [
                {
                  contentType: 'video',
                  mimeType: 'video/mp4',
                  Representation_asArray: [
                    {
                      bandwidth: 438000,
                      frameRate: 25,
                      codecs: 'avc3.4D401E',
                      mimeType: 'video/mp4'
                    },
                    {
                      bandwidth: 827000,
                      frameRate: 30,
                      codecs: 'avc3.4D401E',
                      mimeType: 'video/mp4'
                    },
                    {
                      bandwidth: 1570000,
                      frameRate: 50,
                      codecs: 'avc3.4D401E',
                      mimeType: 'video/mp4'
                    },
                    {
                      bandwidth: 2812000,
                      frameRate: 50,
                      codecs: 'avc3.4D401E',
                      mimeType: 'video/mp4'
                    }
                  ]
                },
                {
                  contentType: 'audio',
                  Representation_asArray: [
                    {
                      bandwidth: 128000
                    }
                  ]
                }
              ]
            }
          };
        });

        it('should leave the manifest unchanged when the config is empty', function () {
          var actualManifest = ManifestModifier.filter(manifest, {});

          expect(actualManifest).toEqual(manifest);
        });

        it('should remove representations with a higher frame rate than the max', function () {
          var expectedManifest = {
            Period: {
              AdaptationSet: [
                {
                  contentType: 'video',
                  mimeType: 'video/mp4',
                  Representation_asArray: [
                    {
                      bandwidth: 438000,
                      frameRate: 25,
                      codecs: 'avc3.4D401E',
                      mimeType: 'video/mp4'
                    },
                    {
                      bandwidth: 827000,
                      frameRate: 30,
                      codecs: 'avc3.4D401E',
                      mimeType: 'video/mp4'
                    }
                  ]
                },
                {
                  contentType: 'audio',
                  Representation_asArray: [
                    {
                      bandwidth: 128000
                    }
                  ]
                }
              ]
            }
          };
          var actualManifest = ManifestModifier.filter(manifest, { maxFps: 30 });

          expect(actualManifest).toEqual(expectedManifest);
        });

        it('should remove representations that are lower than the highest if constantFps is set', function () {
          var expectedManifest = {
            Period: {
              AdaptationSet: [
                {
                  contentType: 'video',
                  mimeType: 'video/mp4',
                  Representation_asArray: [
                    {
                      bandwidth: 1570000,
                      frameRate: 50,
                      codecs: 'avc3.4D401E',
                      mimeType: 'video/mp4'
                    },
                    {
                      bandwidth: 2812000,
                      frameRate: 50,
                      codecs: 'avc3.4D401E',
                      mimeType: 'video/mp4'
                    }
                  ]
                },
                {
                  contentType: 'audio',
                  Representation_asArray: [
                    {
                      bandwidth: 128000
                    }
                  ]
                }
              ]
            }
          };
          var actualManifest = ManifestModifier.filter(manifest, { constantFps: true });

          expect(actualManifest).toEqual(expectedManifest);
        });

        it('should only keep the highest framerate that is not higher than max', function () {
          var expectedManifest = {
            Period: {
              AdaptationSet: [
                {
                  contentType: 'video',
                  mimeType: 'video/mp4',
                  Representation_asArray: [
                    {
                      bandwidth: 827000,
                      frameRate: 30,
                      codecs: 'avc3.4D401E',
                      mimeType: 'video/mp4'
                    }
                  ]
                },
                {
                  contentType: 'audio',
                  Representation_asArray: [
                    {
                      bandwidth: 128000
                    }
                  ]
                }
              ]
            }
          };
          var actualManifest = ManifestModifier.filter(manifest, { constantFps: true, maxFps: 30 });

          expect(actualManifest).toEqual(expectedManifest);
        });

        it('should filter all representations out if none are smaller than the max', function () {
          var expectedManifest = {
            Period: {
              AdaptationSet: [
                {
                  contentType: 'video',
                  mimeType: 'video/mp4',
                  Representation_asArray: []
                },
                {
                  contentType: 'audio',
                  Representation_asArray: [
                    {
                      bandwidth: 128000
                    }
                  ]
                }
              ]
            }
          };
          var actualManifest = ManifestModifier.filter(manifest, { maxFps: 10, constantFps: true });

          expect(actualManifest).toEqual(expectedManifest);
        });
      });

      describe('extractBaseUrl()', function () {
        it('should return the base url from the period', function () {
          var manifest = {
            Period: {
              BaseURL: 'dash/'
            }
          };

          expect(ManifestModifier.extractBaseUrl(manifest)).toBe('dash/');
        });

        it('should return the base url from the root', function () {
          var manifest = {
            BaseURL: {
              __text: 'https://cdn/dash/'
            }
          };

          expect(ManifestModifier.extractBaseUrl(manifest)).toBe('https://cdn/dash/');
        });
      });

      describe('generateBaseUrls()', function () {
        var sources = [
          'https://cdn-a.com/',
          'https://cdn-b.com/'
        ];

        it('should convert the sources into base urls', function () {
          var manifest = {
            Period: {
              BaseURL: 'dash/'
            }
          };

          var expectedManifest = {
            BaseURL_asArray: [
              { __text: 'https://cdn-a.com/dash/', 'dvb:priority': 0, serviceLocation: 'https://cdn-a.com/' },
              { __text: 'https://cdn-b.com/dash/', 'dvb:priority': 1, serviceLocation: 'https://cdn-b.com/' }
            ],
            Period: {}
          };

          ManifestModifier.generateBaseUrls(manifest, sources);

          expect(manifest).toEqual(expectedManifest);
        });

        describe('should return a single base url object for absolute base urls', function () {
          var expectedManifest = {
            Period: {},
            BaseURL: { __text: 'https://cdn-a.com/dash/', 'dvb:priority': 0, serviceLocation: 'https://cdn-a.com/' },
            BaseURL_asArray: [
              { __text: 'https://cdn-a.com/dash/', 'dvb:priority': 0, serviceLocation: 'https://cdn-a.com/' }
            ]
          };

          it('the url is on the manifest as a string', function () {
            var manifest = {
              Period: {},
              BaseURL: 'https://cdn-a.com/dash/'
            };

            ManifestModifier.generateBaseUrls(manifest, sources);

            expect(manifest).toEqual(expectedManifest);
          });

          it('the url is on the manifest as an object', function () {
            var manifest = {
              Period: {},
              BaseURL: {
                __text: 'https://cdn-a.com/dash/'
              }
            };

            ManifestModifier.generateBaseUrls(manifest, sources);

            expect(manifest).toEqual(expectedManifest);
          });

          it('the url is on the manifest in the period as a string', function () {
            var manifest = {
              Period: {
                BaseURL: 'https://cdn-a.com/dash/'
              }
            };

            ManifestModifier.generateBaseUrls(manifest, sources);

            expect(manifest).toEqual(expectedManifest);
          });

          it('the url is on the manifest in the period as an object', function () {
            var manifest = {
              Period: {
                BaseURL: {
                  __text: 'https://cdn-a.com/dash/'
                }
              }
            };

            ManifestModifier.generateBaseUrls(manifest, sources);

            expect(manifest).toEqual(expectedManifest);
          });
        },

        describe('no base url on manifest', function () {
          it('should return base url objects', function () {
            var manifest = {
              Period: {}
            };

            var expectedManifest = {
              Period: {},
              BaseURL_asArray: [
                { __text: 'https://cdn-a.com/', 'dvb:priority': 0, serviceLocation: 'https://cdn-a.com/' },
                { __text: 'https://cdn-b.com/', 'dvb:priority': 1, serviceLocation: 'https://cdn-b.com/' }
              ]
            };

            ManifestModifier.generateBaseUrls(manifest, sources);

            expect(manifest).toEqual(expectedManifest);
          });
        }));
      });
    });
  });

