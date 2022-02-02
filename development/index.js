window.bigscreenPlayer = { playbackStrategy: 'msestrategy'};
// Reminder - Add overrides as appropriate
// e.g overrides: {legacySubtitles: true}

require (['bigscreenplayer/bigscreenplayer'], function(BigscreenPlayer){  
  let playbackElement = document.createElement('div')

  playbackElement.style.position = 'absolute';
  playbackElement.style.height = '720px';
  playbackElement.style.width = '1280px';

  let windowType = 'staticWindow';
  let enableSubtitles = true;
  
  // Useful for testing legacy subtitles implementation
  function setUpCaptionsContainerCSS() {
    var captionsContainer = document.getElementById('playerCaptionsContainer');
    if (captionsContainer) {
      captionsContainer.style.position = 'absolute';
      captionsContainer.style.top = '80%';
      captionsContainer.style.right = '50%';
    }
  }

  document.body.appendChild(playbackElement)

  //ADDING BUTTONS FOR HDR TESTING
  //var hdrgui= true

  var button = document.createElement('button')
  button.style.position='absolute'
  button.style.background='transparent'
  button.style.border='none'

  button.style.backgroundSize="cover"
  button.style.backgroundPosition="center"
  button.style.width="80px"
  button.style.height="80px"
  button.style.marginTop= "600px"

  button.addEventListener('click', function(){
    bigscreenPlayer.play();
 
  });

  document.body.appendChild(button)

  function setplaybuttonhdr(ishdr){
  console.log('setplaybuttonhdr',ishdr)  
    var playfilenamesdr='url("./playsdr.png")'
    var playfilenamehdr='url("./playhlg.png")'

      if(ishdr){
        filename=playfilenamehdr
        }
      else{
        filename=playfilenamesdr
        }
    button.style.backgroundImage=filename
  }

  ////////Pause button

  var pausebutton = document.createElement('button')
  pausebutton.style.position='absolute'
  pausebutton.style.background='transparent'
  pausebutton.style.left= '80px'
  pausebutton.style.width="80px"
  pausebutton.style.height="80px"
  pausebutton.style.border='none'
  //pausebutton.style.backgroundImage=pausefilename
  pausebutton.style.backgroundSize="cover"
  pausebutton.style.backgroundPosition="center"
  pausebutton.style.marginTop= "600px"
  pausebutton.id='PAUSE'

  pausebutton.addEventListener('click', function(){
    bigscreenPlayer.pause();
    
  });
  
  document.body.appendChild(pausebutton)

  function setpausebuttonhdr(ishdr){
    
    var pausefilenamesdr="url('./pausesdr.png')"
    var pausefilenamehdr="url('./pausehlg.png')"

      if(ishdr){
        filename=pausefilenamehdr
        }
      else{
        filename=pausefilenamesdr
        }
    pausebutton.style.backgroundImage=filename
  }

  /////////Logo

  var img = document.createElement('img')
  img.style.position='absolute'
  img.style.paddingTop= "60px"
  img.style.paddingLeft="30px"
  //img.style.width="100px";
  //img.style.height="100px";

  document.body.appendChild(img)

  function setimghdr(ishdr){
      
    var imgsdr='./bbc_logo.png'
    var imghdr='./bbchlg.png'
    //var imghdr='./bbchlg.png'

      if(ishdr){
        filename=imghdr
        }
      else{
        filename=imgsdr
        }
    img.src=filename
    //img.style.backgroundImage=filename
  }

  ////////set HDR on/off

  let hdrState = false;

  function setHdr(isHdr) {
    setplaybuttonhdr(isHdr)
    setpausebuttonhdr(isHdr)
    setimghdr(isHdr)
    settxthdr(isHdr)
    
    hdrState = isHdr;

    const currentTime = bigscreenPlayer.getCurrentTime();

    bigscreenPlayer.tearDown();
    loadPlayer(isHdr, currentTime);
    bigscreenPlayer.customiseSubtitles({ hdr });
  }

  const toggleHdr = () => setHdr(!hdrState);

  window.setHdr = setHdr   /// make visible in global (document) scope
  
  var hdrButton = document.createElement('button')
  hdrButton.style.position='absolute'
  hdrButton.style.background='transparent'
  hdrButton.style.border='none'
  hdrButton.style.fontSize='20px'
  hdrButton.style.backgroundColor = 'black';
  hdrButton.style.color = 'white';
  hdrButton.style.marginTop= "740px"
  hdrButton.style.padding= "10px"
  hdrButton.innerText = 'Switch Mode'

  function sendMonitorHdrCommand() {
    // Attempt to send INFObutton 5 command to monitor
    fetch('http://localhost:8000/hdr', {
        method: 'POST',
    })
        .then((response) => {
          if (response)
            console.log('Set monitor HDR mode successfully')
          else 
            console.error('Failed to set monitor HDR mode')
        })
        .catch(console.error);
  }

  hdrButton.onclick = function () {
    console.log('hdrButton.onclick')
    toggleHdr();
   // console.log('hdrButton.onclick')
    sendMonitorHdrCommand();
  }

  document.body.appendChild(hdrButton)

  
  //add some text: Video Title
  var t = document.createElement("INPUT")


  //t.setAttribute("type", "text")
  t.setAttribute("value", "    Playing Now: Wonders of The Celtic Deep ")
  t.style.position='absolute'
  //t.style.color= 'White'
  t.style.width="420px"
  t.style.height="40px"
  //t.style.background= '#F54997'
  t.style.left= '850px'
  t.style.fontWeight='bold'
  t.style.fontSize='20px'
  t.style.top= "25px"


  function settxthdr(ishdr){
      
    var btxtsdr='#F54997'
    var btxthdr='#a84f85'

    var txtsdr='white'
    var txthdr ='#b8b8b8'

      if(ishdr){
        bcolor= btxthdr
        tcolor= txthdr
        }
      else{
        bcolor= btxtsdr
        tcolor= txtsdr
        }
    t.style.background=bcolor
    t.style.color= tcolor
  }
  document.body.appendChild(t)


  const getStreamURL = function (hdr = false) {
    return new Promise(function (resolve) {
        //window._antie_callback_ms_p05qtr4g = function (data) {

        const supplier = hdr ? 'mf_akamai_uhd' : 'mf_akamai';

        // The above is the same as:
        // let supplier; 
        // if (hdr)
        //   supplier = 'mf_akamai_uhd';
        // else 
        //   supplier = 'mf_akamai';
        
        window._antie_callback_ms_p09xsx8m = function (data) {  
            console.log(data);

            let akamaiDashConnection;

            for (const media of data.media) {
              akamaiDashConnection = media.connection.find(
                (conn) => 
                  conn.supplier === supplier && conn.transferFormat === 'dash' 
              );

              if (akamaiDashConnection)
                break;
            }

            if (!akamaiDashConnection)
              throw new Error('Could not find Akamai DASH stream.');

            console.log(akamaiDashConnection);
            resolve(akamaiDashConnection.href);
        }
        
        script = document.createElement('script');
        script.type = 'text/javascript';
        ///UHD////
       // script.src = 'https://securegate.iplayer.bbc.co.uk/mediaselector/6/select/version/2.0/vpid/m000qzd1/format/json/mediaset/iptv-uhd/jsfunc/_antie_callback_ms_m000qzd1/proto/https';
        //script.src = 'https://open.live.bbc.co.uk/mediaselector/6/select/version/2.0/vpid/m000qzd1/format/json/mediaset/iptv-sd/jsfunc/_antie_callback_ms_m000qzd1/proto/https';
        
        ////HD///https://open.live.bbc.co.uk/mediaselector/6/select/version/2.0/mediaset/iptv-sd/vpid/m000qzd1/
        // script.src = 'https://securegate.iplayer.bbc.co.uk/mediaselector/6/select/version/2.0/vpid/m000qzd1/format/json/mediaset/iptv-all/jsfunc/_antie_callback_ms_m000qzd1/proto/https';
        //script.src = 'https://securegate.iplayer.bbc.co.uk/mediaselector/6/select/version/2.0/vpid/m000qzd1/format/json/mediaset/iptv-all/jsfunc/_antie_callback_ms_m000qzd1/proto/https';
        /////

         //script.src = 'https://securegate.iplayer.bbc.co.uk/mediaselector/6/select/version/2.0/vpid/m000qzd1/format/json/mediaset/iptv-all/jsfunc/_antie_callback_ms_m000qzd1/proto/https';
        // script.src = 'https://securegate.iplayer.bbc.co.uk/mediaselector/6/select/version/2.0/vpid/p05qtr4g/format/json/mediaset/iptv-all/jsfunc/_antie_callback_ms_p05qtr4g/proto/https';
       // script.src = 'https://securegate.iplayer.bbc.co.uk/mediaselector/6/select/version/2.0/vpid/m000qw33/format/json/mediaset/iptv-uhd/jsfunc/_antie_callback_ms_m000qw33/proto/https';

        const mediaset = hdr ? 'iptv-uhd' : 'iptv-all';

        //script.src = `https://securegate.iplayer.bbc.co.uk/mediaselector/6/select/version/2.0/vpid/m000qzd1/format/json/mediaset/${mediaset}/jsfunc/_antie_callback_ms_m000qzd1/proto/https`;
        script.src = `https://securegate.iplayer.bbc.co.uk/mediaselector/6/select/version/2.0/vpid/p09xsx8m/format/json/mediaset/${mediaset}/jsfunc/_antie_callback_ms_p09xsx8m/proto/https`;

        document.head.appendChild(script);
        document.head.removeChild(script);
    });
  }

  let bigscreenPlayer = BigscreenPlayer();
  window._bigscreenPlayer = bigscreenPlayer;

  bigscreenPlayer.registerPlugin({onSubtitlesLoadError: function () {
    console.log('Loading subtitles failed...')
  }})

  bigscreenPlayer.registerPlugin({onSubtitlesRenderError: function () {
    console.log('Rendering subtitles failed...')
  }})

  bigscreenPlayer.registerPlugin({onSubtitlesTransformError: function () {
    console.log('Transforming subtitles failed...')
  }})

  const loadPlayer = function(hdr = false, initialPlaybackTime = 470) {
    getStreamURL(hdr)
      .then(function (streamURL) {
        let minimalData = {
          initialPlaybackTime: initialPlaybackTime,
          media: {
            //captions: [ {url: "http://localhost:3008/doctorWhoSubs.xml",
            //captions: [ {url: "./Peaky_Blinders_S2E2.xml",
            //captions: [ {url: "./Black_Narcissus_S1E2.xml",
            captions: [ {url: "./The_Celtic_Deep.xml",
            cdn: 'test'}],
            type: 'application/dash+xml',
            mimeType: 'video/mp4',
            kind: 'video',
            urls: [{
              // Content from DASH IF testing assests (used in their reference player)
              // https://reference.dashif.org/dash.js/v2.9.2/samples/dash-if-reference-player/index.htm
              url: streamURL,
              //url:'http://vod-dash-uk-live.akamaized.net/usp/auth/vod/piff_abr_full_hd/1844d7-b04l8yty/vf_b04l8yty_f893eb14-a343-4d51-bc51-d04fa75d3b98.ism/iptv_hd_abr_v1_dash_master.mpd?__gda__=1625151430_5f7e7fb83d230b2704133531c3bebda0',
              cdn: 'dash.akamaized.net'
            }],
          }
        };
  
        bigscreenPlayer.init(playbackElement, minimalData, windowType, enableSubtitles,
          {
            onSuccess: function () {
              // bigscreenPlayer.toggleDebug();

              // The syntax below is equal to:
              // bigscreenPlayer.customiseSubtitles({ hdr: hdr });
              bigscreenPlayer.customiseSubtitles({ hdr });
              console.log('bigscreenPlayer.customiseSubtitles',hdr)
              setplaybuttonhdr(hdr);
              setpausebuttonhdr(hdr);
              setimghdr(hdr);
              settxthdr(hdr);

              setUpCaptionsContainerCSS();
            },
            onError: function () {
              bigscreenPlayer.toggleDsebug();
              DebugTool.info('Initialisation failed.')
            }
        });
      });
  }

  loadPlayer(false);
})
