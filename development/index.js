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
  //button.style.backgroundImage='http://localhost:3008/playsdr.png'
  //button.style.backgroundImage=playfilename
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
    
    var playfilenamesdr="url('./playsdr.png')"
    var playfilenamehdr="url('./playhdr.png')"

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


  pausebutton.addEventListener('click', function(){
    bigscreenPlayer.pause();
    
  });
  
  document.body.appendChild(pausebutton)

  function setpausebuttonhdr(ishdr){
    
    var pausefilenamesdr="url('./pausesdr.png')"
    var pausefilenamehdr="url('./pausehdr.png')"

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
  var imghdr='./bbc_hdrlogo.png'

    if(ishdr){
      filename=imghdr
      }
    else{
      filename=imgsdr
      }
  img.src=filename
}

////Some Text


  ////////set HDR on/off

  function setHdr(isHdr) {
    setplaybuttonhdr(isHdr)
    setpausebuttonhdr(isHdr)
    setimghdr(isHdr)
    settxthdr(isHdr)
    bigscreenPlayer.customiseSubtitles({hdr:isHdr})
  }

  window.setHdr = setHdr   /// make visible in global (document) scope


  
//add some text: Video Title
var t = document.createElement("INPUT")


//t.setAttribute("type", "text")
t.setAttribute("value", "    Playing now: Peaky Blinders ")
t.style.position='absolute'
//t.style.color= 'White'
t.style.width="300px"
t.style.height="40px"
//t.style.background= '#F54997'
t.style.left= '960px'
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





  
  
  // var pausefilenamesdr="url('http://localhost:3008/pausesdr.png')"
  // var pausefilenamehdr="url('http://localhost:3008/pausehdr.png')"

  // var pausefilename=pausefilenamesdr
  
  // if (hdrgui){
  //     pausefilename=pausefilenamehdr
  // }

//   var pausebutton = document.createElement('button')
//   pausebutton.style.position='absolute'
//   pausebutton.style.background='transparent'
//   pausebutton.style.left= '80px'
//   pausebutton.style.width="80px"
//   pausebutton.style.height="80px"
//   pausebutton.style.border='none'
//   pausebutton.style.backgroundImage=pausefilename
//   pausebutton.style.backgroundSize="cover"
//   pausebutton.style.backgroundPosition="center"
//   pausebutton.style.marginTop= "600px"


//   pausebutton.addEventListener('click', function(){
//     bigscreenPlayer.pause();
    
//   });


//   var img = document.createElement('img')
  
//   var imgsdr='http://localhost:3008/bbc_logo.png'
//   var imghdr='http://localhost:3008/bbc_hdrlogo.png'

//   var logofilename=imgsdr
  
//     if (hdrgui){
//        logofilename=imghdr
//     }

// img.style.position='absolute'
// img.style.paddingTop= "10px"
// img.style.paddingLeft="10px"
// // img.style.width="100px";
// // img.style.height="100px";

// img.src=logofilename

// // var img = document.querySelector("img"); 
// // img.src = "https://picsum.photos/200/301";

// //document.getElementById('body').appendChild(img);
// document.body.appendChild(img)

// document.body.appendChild(pausebutton)


  const getStreamURL = function () {
    return new Promise(function (resolve) {
        window._antie_callback_ms_p05qtr4g = function (data) {
            console.log(data);

            const connection = data.media[0].connection;

            const akamaiDashConnection = connection.find(
              (conn) => 
                conn.supplier === 'mf_akamai' && conn.transferFormat === 'dash'
            );
            if (!akamaiDashConnection)
              throw new Error('Could not find Akamai DASH stream.');

            console.log(akamaiDashConnection);
            resolve(akamaiDashConnection.href);
        }
        
        script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://securegate.iplayer.bbc.co.uk/mediaselector/6/select/version/2.0/vpid/p05qtr4g/format/json/mediaset/iptv-all/jsfunc/_antie_callback_ms_p05qtr4g/proto/https';
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

  getStreamURL()
    .then(function (streamURL) {
      let minimalData = {
        initialPlaybackTime: 30,
        media: {
          //captions: [ {url: "http://localhost:3008/sub.xml", cdn: 'test'}],
          //captions: [ {url: "http://localhost:3008/doctorWhoSubs.xml",
          captions: [ {url: "./Peaky_Blinders_S2E2.xml",
          //sevenWorldsOnePlanetSub
          cdn: 'test'}],
          type: 'application/dash+xml',
          mimeType: 'video/mp4',
          kind: 'video',
          urls: [{
            // Content from DASH IF testing assests (used in their reference player)
            // https://reference.dashif.org/dash.js/v2.9.2/samples/dash-if-reference-player/index.htm
            url: streamURL,
            //url:'//vod-uhd-uk-live.akamaized.net/r1brygt0-pips-pid-m000c5x9/scmaf_abr_full_uhd/rd/iptv_uhd_v1_master.mpd?__gda__=1623683111_249b213fc4d025851866281848cb27b7',
            //url:'http://vod-dash-uk-live.akamaized.net/usp/auth/vod/piff_abr_full_sd_ad/1844d7-b04l8yty/vf_b04l8yty_b9eaabe7-1e59-4250-953f-94450da8f50e.ism.hlsv2.ism/iptv_sdlow_abr_v2_dash_master.mpd?__gda__=1623684338_8e1a67cf14ac338cf144bfa2e94f990a',
            //url:'http://vod-dash-uk-live.akamaized.net/usp/auth/vod/piff_abr_full_sd_ad/1844d7-b04l8yty/vf_b04l8yty_b9eaabe7-1e59-4250-953f-94450da8f50e.ism/pc_hd_abr_v2_dash_master.mpd?__gda__=1623684626_88b60bdf2ac4daa541baea52c1cc7e93',
           // url:'http://vod-hls-uk-live.akamaized.net/usp/auth/vod/piff_abr_full_hd/1844d7-b04l8yty/vf_b04l8yty_f893eb14-a343-4d51-bc51-d04fa75d3b98.ism.hlsv2.ism/iptv_hd_abr_v1_hls_master.m3u8?__gda__=1623699488_a71a443b619278ff48e7204d595a4cc1',
            //url:'https://b4-eqsl-bbc.live.bidi.net.uk/vod-dash-uk/usp/auth/vod/piff_abr_full_hd/d9b872-m000pb14/vf_m000pb14_b17efb13-ebfe-4bb6-a483-de8b8a485e18.ism/iptv_hd_bvq_abr_v1_dash_master.mpd?at=9qkH4cCz0216fbd99766556cea4088658727cd30ff9dce3d5c2c272eafcc0',
            //url:'https://vod-uhd-uk-live.akamaized.net/r1brygt0-pips-pid-m000c5x9/scmaf_abr_full_uhd/rd/iptv_uhd_v1_master.mpd?__gda__=1621871788_46151ce24b596aa903c4c755081aa766',
            //uhd Seven Worlds One Planet url:'https://vod-uhd-uk-live.akamaized.net/r1brygt0-pips-pid-m000c5x9/scmaf_abr_full_uhd/rd/iptv_uhd_v1_master.mpd?__gda__=1621883321_0e1c4ae19c0fa4e0e0e2709008310e6b',
            //url:'http://vod-dash-uk-live.akamaized.net/usp/auth/vod/piff_abr_full_hd/1844d7-b04l8yty/vf_b04l8yty_f893eb14-a343-4d51-bc51-d04fa75d3b98.ism/iptv_hd_abr_v1_dash_master.mpd?__gda__=1624544537_f465c0dc9fe06172ee2e6a30e9a68458',
            //url:'http://vod-dash-uk-live.akamaized.net/usp/auth/vod/piff_abr_full_hd/1844d7-b04l8yty/vf_b04l8yty_f893eb14-a343-4d51-bc51-d04fa75d3b98.ism/iptv_hd_abr_v1_dash_master.mpd?__gda__=1625151430_5f7e7fb83d230b2704133531c3bebda0',
            cdn: 'dash.akamaized.net'
          }]
        }
      };

      bigscreenPlayer.init(playbackElement, minimalData, windowType, enableSubtitles,
        {
          onSuccess: function () {
           // bigscreenPlayer.toggleDebug();
            setUpCaptionsContainerCSS();
            setHdr(false)
          },
          onError: function () {
            bigscreenPlayer.toggleDebug();
            DebugTool.info('Initialisation failed.')
          }
      });
    });
})
