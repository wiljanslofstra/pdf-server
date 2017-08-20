# PDF-server

Create PDF files from HTML or a URL. It uses the new Puppeteer framework from the
Chrome team to render pages on a Chromium headless browser.

## Authorization

Authorizing to make PDF requests is very simple, in the config.js file there's an
array of API keys, this allows to make multiple keys when necessary.
You pass the API key as Authorization header on the request:

```
Authorization: Basic API_KEY_HERE
```

## Config

**Whitelist**

Contains the URLs that are allowed as source to generate screenshots and PDFs for. It checks against
the URL hostname in the request. Setting whitelist to false will disable the checks.

**Keys**

Contains API keys for the request see 'Authorization' above.

## /pdf

```
url               required|optional  URL of the page to render, use when HTML is not given
html              required|optional  HTML to render, use when URL is not given
format            optional           Page format (e.g. A4, A3) (default: A4)
landscape         optional           Render in landscape mode (default: false)
displayHeaderFooter optional         Show header and footer in PDF output (default: false)
scale             optional           Zoom the page in/out (default: 1)
emulateMedia      optional           Emulates a media type, for example print (default: screen)
printBackground   optional           Print page background (default: true)
margin.top        optional           Margin top (e.g. 2cm or 20px) (default: 0cm)
margin.bottom     optional           Margin bottom (e.g. 2cm or 20px) (default: 0cm)
margin.left       optional           Margin left (e.g. 2cm or 20px) (default: 0cm)
margin.right      optional           Margin right (e.g. 2cm or 20px) (default: 0cm)
```

**PHP cURL example**

```
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_PORT => "3000",
  CURLOPT_URL => "http://localhost:3000/pdf",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "html=%3Ch1%3EHello%20world%3C%2Fh1%3E&margin.top=0.5cm&margin.bottom=0.5cm&margin.left=0.5cm&margin.right=0.5cm&landscape=true&format=A3&scale=0.75",
  CURLOPT_HTTPHEADER => array(
    "authorization: Basic adprAlKJearJbKZhxb7xrDTXJytqsvXTIQ0c1lKl",
    "cache-control: no-cache",
    "content-type: application/x-www-form-urlencoded"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
```

**Returns**

```
{
    "statusCode": 200,
    "message": {
        "path": "pdf\/generated_19_08_2017_21_42_47.pdf",
        "options": {
            "format": "A3",
            "landscape": true,
            "displayHeaderFooter": false,
            "scale": 0.75,
            "emulateMedia": "screen",
            "printBackground": true,
            "filePath": "pdf\/generated_19_08_2017_21_42_47.pdf",
            "margin": {
                "top": "0.5cm",
                "bottom": "0.5cm",
                "left": "0.5cm",
                "right": "0.5cm"
            }
        },
        "time": 855
    }
}
```

## /screenshot

```
url             required   Valid URL to be rendered
emulateMedia    optional   Emulates a media type, for example print (default: screen)
viewport.width  optional   Width of the viewport (default: 800)
viewport.height optional   Height of the viewport (default: 600)
```

**PHP cURL example**

```
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_PORT => "3000",
  CURLOPT_URL => "http://localhost:3000/screenshot",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "POST",
  CURLOPT_POSTFIELDS => "viewport.width=1024&viewport.height=800&url=https%3A%2F%2Fwww.wiljanslofstra.com%2F&emulateMedia=screen",
  CURLOPT_HTTPHEADER => array(
    "authorization: Basic adprAlKJearJbKZhxb7xrDTXJytqsvXTIQ0c1lKl",
    "cache-control: no-cache",
    "content-type: application/x-www-form-urlencoded"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}
```

**Returns**

```
{
    "statusCode": 200,
    "message": {
        "path": "screenshots\/www.wiljanslofstra.com_19_08_2017_21_45_30.png",
        "options": {
            "viewport": {
                "width": "1024",
                "height": "800"
            },
            "url": "https:\/\/www.wiljanslofstra.com\/",
            "emulateMedia": "screen"
        },
        "time": 2068
    }
}
```

## Tests

The're a few functional tests for the /pdf endpoint and the authorization layer.

```
npm test
```
