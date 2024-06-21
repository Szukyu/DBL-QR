class DblTimestampHelper{
  static timestampEncoding = ['B','C','D','E','F','G','H','J','K','M','N','P','Q','R','S','T'];

  static createDblTimestamp(){
    let creationDate = Date.now().toString(16);
    let encodedTimestamp = '';

    for (let i = 0;i < creationDate.length;i++) {
      encodedTimestamp += DblTimestampHelper.timestampEncoding[parseInt(creationDate[i], 16)];
    }

    return encodedTimestamp;
  }

  static decodeDblTimestamp(timestampString){
    let decodedDblTimestamp = '';

    for (let i = 0;i < timestampString.length;i++) {
      decodedDblTimestamp += DblTimestampHelper.timestampEncoding.indexOf(timestampString[i]).toString(16);
    }

    return decodedDblTimestamp;
  }
}

function getSelectedGenerationmethod(){
   return 'auto';
}

document.addEventListener("DOMContentLoaded", (event) => {
    const formElement = document.querySelector('#dbl-qr');

    const friendInput1 = document.querySelector('[name="dbl-qr-1"]');
    const friendInput2 = document.querySelector('[name="dbl-qr-2"]');
    const friendInput3 = document.querySelector('[name="dbl-qr-3"]');

    // Change Values to Your Friends
    friendInput1.value = "eus7pkjv";
    friendInput2.value = "ys586a77";
    friendInput3.value = "sq3k4j75";

    const qrDisplay1 = document.querySelector('#qr-display-1');
    const qrDisplay2 = document.querySelector('#qr-display-2');
    const qrDisplay3 = document.querySelector('#qr-display-3');

    const uglyAssBitch = [
      {input: friendInput1, display: qrDisplay1 },
      {input: friendInput2, display: qrDisplay2 },
      {input: friendInput3, display: qrDisplay3 },
    ];

    function handleFormSubmission() {
      DblTimestampHelper.createDblTimestamp();
  
      if ('auto' === getSelectedGenerationmethod()) {
        uglyAssBitch.forEach((friend) => {
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
        });
      }
    }
  
    handleFormSubmission();
  
    formElement.addEventListener('submit', (event) => {
      event.preventDefault();
      handleFormSubmission();
    });
});