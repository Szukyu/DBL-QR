class DblTimestampHelper {
  static timestampEncoding = ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'M', 'N', 'P', 'Q', 'R', 'S', 'T'];

  static createDblTimestamp() {
    let creationDate = Date.now().toString(16);
    let encodedTimestamp = '';

    for (let i = 0; i < creationDate.length; i++) {
      encodedTimestamp += DblTimestampHelper.timestampEncoding[parseInt(creationDate[i], 16)];
    }

    return encodedTimestamp;
  }

  static decodeDblTimestamp(timestampString) {
    let decodedDblTimestamp = '';

    for (let i = 0; i < timestampString.length; i++) {
      decodedDblTimestamp += DblTimestampHelper.timestampEncoding.indexOf(timestampString[i]).toString(16);
    }

    return decodedDblTimestamp;
  }
}

function getSelectedGenerationmethod() {
  return document.querySelector('[name="qr-method"]:checked')?.value;
}

document.addEventListener("DOMContentLoaded", (event) => {
  const dblRegexPattern = new RegExp('^4,[a-zA-Z0-9]{8}');

  const methodFieldset = document.querySelector('.qr-method');

  const formElement = document.querySelector('.form');
  const fileField = document.querySelector('#qrcode');
  const qrField = document.querySelector('#qrcode_b64');

  // Set initial values
  document.querySelector('[name="dbl-qr-1"]').value = "eus7pkjv";
  document.querySelector('[name="dbl-qr-2"]').value = "ys586a77";
  document.querySelector('[name="dbl-qr-3"]').value = "sq3k4j75";

  const friendInput1 = document.querySelector('[name="dbl-qr-1"]');
  const friendInput2 = document.querySelector('[name="dbl-qr-2"]');
  const friendInput3 = document.querySelector('[name="dbl-qr-3"]');

  const qrDisplay1 = document.querySelector('#qr-display-1');
  const qrDisplay2 = document.querySelector('#qr-display-2');
  const qrDisplay3 = document.querySelector('#qr-display-3');

  const szu = [
    { input: friendInput1, display: qrDisplay1 },
    { input: friendInput2, display: qrDisplay2 },
    { input: friendInput3, display: qrDisplay3 },
  ];

  function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });
  }

  function decodeImageFromBase64(data, callback) {
    // set callback
    qrcode.callback = callback;
    // Start decoding
    qrcode.decode(data);
  }

  methodFieldset.addEventListener('change', (event) => {
    fileField.toggleAttribute('required', 'manual' === getSelectedGenerationmethod());
  });

  formElement.addEventListener('submit', async (event) => {
    event.preventDefault();

    DblTimestampHelper.createDblTimestamp();

    if ('auto' === getSelectedGenerationmethod()) {
      await Promise.all(szu.map(async (friend) => {
        if (friend.input.value.length === 0) {
          return;
        }

        let newQr = '4,' + friend.input.value + DblTimestampHelper.createDblTimestamp();

        friend.display.innerHTML = '';

        let qrcode = new QRCode(friend.display, {
          text: newQr,
          width: 180,
          height: 180,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      }));
    } else {
      decodeImageFromBase64(qrField.value, function (decodedInformation) {
        if (decodedInformation === null || !decodedInformation.match(dblRegexPattern)) {
          alert('Can\'t find your DBL info from image. Try cropping the image to only show the QR code.');
          return;
        }

        szu.forEach((friend) => {
          if (friend.input.value.length === 0) {
            return;
          }

          let newQr = decodedInformation.replace(dblRegexPattern, '4,' + friend.input.value);

          friend.display.innerHTML = '';

          let qrcode = new QRCode(friend.display, {
            text: newQr,
            width: 180,
            height: 180,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
          });
        });
      });
    }

    // Submit the form after processing
    formElement.submit();
  });
});