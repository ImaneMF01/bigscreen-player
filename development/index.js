require (['bigscreenplayer/bigscreenplayer'], function(BigscreenPlayer){  
  let playbackElement = document.createElement('div')
  let windowType = 'slidingWindow';
  let enableSubtitles = false;
  
  let minimalData = {
      serverDate: new Date(),
      media: {
        type: 'application/dash+xml',
        mimeType: 'video/mp4',
        kind: 'video',
        urls: [
          {
            // Content from DASH IF testing assests (used in their reference player)
            // https://reference.dashif.org/dash.js/v2.9.2/samples/dash-if-reference-player/index.htm
            url: 'LIVE_DASH_URL',
            cdn: 'dash.akamaized.net'
          }
        ]
      }
    };

    let fakeDevice = {
      getConfig: function () {
        return {};
      }
    }

  document.body.appendChild(playbackElement)
  let bigscreenPlayer = BigscreenPlayer();
  window._bigscreenPlayer = bigscreenPlayer;

  bigscreenPlayer.init(playbackElement, minimalData, windowType, enableSubtitles, fakeDevice,
    {
      onSuccess: function () {
        bigscreenPlayer.toggleDebug();
        console.log(bigscreenPlayer.getCurrentTime());
      },
      onError: function () {
        bigscreenPlayer.toggleDebug();
        DebugTool.info('Initialisation failed.')
      }
  });
})
