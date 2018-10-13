const html = (data,type,title,description,image,video,serialize)=>(
   `
   <!doctype html>
<html lang="en">

<head>
    <title>${title}</title>
  <script src="/bundle.js" defer></script>
            <script>window.__INITIAL_DATA__ = ${serialize(data)}</script>
            <meta property="og:url"                content=${url} />
        <meta property="og:type"               content=${type}/>
        <meta property="og:title"              content=${title} />
        <meta property="og:description"        content=${description} />
        <meta property="og:image"              content=${image} />
        <meta property="og:video"              content=${video} />
    <link type="text/css" rel="stylesheet" href="../../../css/bootstrap.min.css" />
    <!-- <link type="text/css" rel="stylesheet" href="../../../css/style.css" /> -->
    <link type="text/css" rel="stylesheet" href="../../../css/video-react.css" />

    <!-- Import materialize.css -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/css/materialize.min.css" rel="stylesheet">

    <!--Import Google Icon Font-->
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <script defer src="https://use.fontawesome.com/releases/v5.0.6/js/all.js"></script>
    
    <script src="../../../radionomy.js"></script>
    <!--Import materialize.css-->
    <!-- <link type="text/css" rel="stylesheet" href="css/materialize.min.css" media="screen,projection" /> -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.4.0/animate.min.css">
    <!-- Compiled and minified CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-alpha.3/css/materialize.min.css">
    <!-- custom css -->

    <link type="text/css" rel="stylesheet" href="../../../css/animate.min.css" />
    <link type="text/css" rel="stylesheet" href="../../../css/custom.css" />
    <link type="text/css" rel="stylesheet" href="../../../css/reactSelect.css" />
    <!-- Compiled and minified JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-alpha.3/js/materialize.min.js"></script>
    <!--Let browser know website is optimized for mobile-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>

<body>
    <!-- Import jQuery before materialize.js -->
    <script src="https://code.jquery.com/jquery-2.1.1.min.js"></script>
    <!-- <script src="./js/jquery.countdown.min.js"></script> -->
    <!-- <script src="./js/jquery.min.js"></script> -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.98.0/js/materialize.min.js"></script>
    <!-- And then your bundled js -->
    <!-- slick carousel -->
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" />
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
    />

    <div id="root"></div>
    <!-- facebo share -->
<script>(function (win, doc, script, source, objectName) { (win.RadionomyPlayerObject = win.RadionomyPlayerObject || []).push(objectName); win[objectName] = win[objectName] || function (k, v) { (win[objectName].parameters = win[objectName].parameters || { src: source, version: '1.1' })[k] = v; }; var js, rjs = doc.getElementsByTagName(script)[0]; js = doc.createElement(script); js.async = 1; js.src = source; rjs.parentNode.insertBefore(js, rjs); }(window, document, 'script', 'https://www.radionomy.com/js/radionomy.player.js', 'radplayer'));
radplayer('url', 'tamtamtoolsradio');
radplayer('type', 'medium');
radplayer('autoplay', '0');
radplayer('volume', '50');
radplayer('color1', '#000000');
radplayer('color2', '#ffffff');
</script>
    <!-- facebook share end -->


</body>

</html>
   `
)

export default html