$(document).ready(() => {
  $('#btn_cmrscan').click(() => {
    $('#qr_scanner').show(500);
    $('#qr_file').hide(1000);
    $('#student_box').hide(1000);
    scanner.start();
  })

  $('#btn_file').click(() => {
    $('#student_box').hide(1000);
    $('#qr_scanner').hide(1000);
    $('#qr_file').show(500);
    scanner.stop();
  })

  $('#btn_list').click(() => {
    $('#qr_file').hide(1000);
    $('#qr_scanner').hide(1000);
    $('#student_box').show(500);
    scanner.stop();
  })

  $('#add_btn').click(function () {
    let frmData = {
      studentID: $('#studentID').val(),
      name: $('#name').val(),
      gender: $('#gender').val(),
      birth: $('#birth').val(),
      address: $('#address').val(),
      phone: $('#phone').val()
    }
    if (frmData.studentID != "" && frmData.name != "" && frmData.gender != "" && frmData.birth != "" && frmData.address != "" && frmData.phone != "") {
      let opt = {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(frmData)
      }
      fetch('/addstd', opt)
        .then(function (response) {
          if (response.status == 200) {
            let htmls = `
            <tr class="list_student-item">
            <td>${frmData.studentID}</td>
            <td>${frmData.name}</td>
            <td>${frmData.birth}</td>
            <td>${frmData.gender}</td>
            <td>${frmData.address}</td>
            <td>${frmData.phone}</td>
            </tr>`;
            $('#studentID').val('')
            $('#name').val('')
            $('#birth').val('')
            $('#address').val('')
            $('#phone').val('')
            $('#gender').val('')
            $('#list_students').append(htmls)
          } else if (response.status == 208) {
            alert('Sinh viên đã tồn tại')
          } else {
            alert('Server đang bị lỗi! Vui lòng thử lại sau!')
          }
          return response.json()
        })
        .then(cb => {
          console.log('Thêm thành công!!');
        })
    }
    else {
      alert('Vui lòng điền đầy đủ thông tin');
    }
  })

  $('#list_students tr').click(function (event) {
    var hientai = $(this).index() + 1;
    $('#list_students tr').removeClass('active');
    $(this).addClass('active');
    let id = $('#list_students tr:nth-child(' + (hientai) + ') td:nth-child(1)').html();
    let url = `/getstd${id}`
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(function (student) {
        $('#studentID').val(student.studentID)
        $('#name').val(student.name)
        let day = new Date(student.birth)
        $('#birth').val(day.toISOString().substr(0, 10))
        $('#address').val(student.address)
        $('#phone').val(student.phone)
        $('#gender').val(student.gender)
        $('#del-btn').css('display', 'inline')
        $('#edit-btn').css('display', 'inline')
        $('#cancel-btn').css('display', 'inline')
        $('#add_btn').css('display', 'none')
      })

    $('#del-btn').click(function (event) {
      fetch(`/delstd${id}`, { method: 'delete' })
        .then(response => {
          if (response.status == 200) {
            $('#list_students tr:nth-child(' + (hientai) + ')').remove();
            $('#studentID').val('')
            $('#name').val('')
            $('#birth').val('')
            $('#address').val('')
            $('#phone').val('')
            $('#gender').val('')
            $('#del-btn').css('display', 'none')
            $('#edit-btn').css('display', 'none')
            $('#cancel-btn').css('display', 'none')
            $('#add_btn').css('display', 'inline')
          }
          else alert('Lỗi server');
        })
    })

    $('#edit-btn').click(function (event) {
      let frmData = {
        studentID: $('#studentID').val(),
        name: $('#name').val(),
        gender: $('#gender').val(),
        birth: $('#birth').val(),
        address: $('#address').val(),
        phone: $('#phone').val()
      }
      if (frmData.studentID != "" && frmData.name != "" && frmData.gender != "" && frmData.birth != "" && frmData.address != "" && frmData.phone != "") {
        let opt = {
          method: 'put',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(frmData)
        }
        fetch('/updstd', opt)
          .then(function (response) {
            if (response.status == 200) {
              let htmls = `
              <td>${frmData.studentID}</td>
              <td>${frmData.name}</td>
              <td>${frmData.birth}</td>
              <td>${frmData.gender}</td>
              <td>${frmData.address}</td>
              <td>${frmData.phone}</td>`;
              $('#list_students tr:nth-child(' + (hientai) + ')').html(htmls)
            }
            else {
              alert('Server đang bị lỗi! Vui lòng thử lại sau!')
            }
            $('#edit-btn').unbind('click');
          })
      }
      else {
        alert('Vui lòng điền đầy đủ thông tin');
      }
    })

    $('#cancel-btn').click(function (event) {
      $('#list_students tr').removeClass('active');
      $('#studentID').val('')
      $('#name').val('')
      $('#birth').val('')
      $('#address').val('')
      $('#phone').val('')
      $('#gender').val('')
      $('#del-btn').css('display', 'none')
      $('#edit-btn').css('display', 'none')
      $('#cancel-btn').css('display', 'none')
      $('#add_btn').css('display', 'inline')
    })
  })

  $('#create-btn').click(function (event) {
    let code = $('#studentID').val()
    let name = $('#name').val()
    var opts = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 0.3,
      margin: 1,
      color: {
        dark: "#010599FF",
        light: "#FFBF60FF"
      }
    }
    QRCode.toDataURL(code, opts, function (err, url) {
      if (err) throw err
      var img = document.getElementById('img-code')
      img.src = url
      let htmls = `<a href="${url}" download="${name}_${code}.jpeg"><button style="background-color: aqua; padding: 5px; margin-top: 5px;">Tải ảnh</button></a>`
      $('#dow_img').html(htmls);
    })
  })
});

QrScanner.WORKER_PATH = '/js/qr-scanner/qr-scanner-worker.min.js';

const video = document.getElementById('qr-video');
const camHasCamera = document.getElementById('cam-has-camera');
const camHasFlash = document.getElementById('cam-has-flash');
const flashToggle = document.getElementById('flash-toggle');
const flashState = document.getElementById('flash-state');
const camQrResult = document.getElementById('cam-qr-result');
const camQrResultTimestamp = document.getElementById('cam-qr-result-timestamp');
const fileSelector = document.getElementById('file-selector');
const fileQrResult = document.getElementById('file-qr-result');

QrScanner.hasCamera().then(hasCamera => camHasCamera.textContent = hasCamera);

const scanner = new QrScanner(video, result => {
  setResult(camQrResult, result)
  let url = `/getstd${result}`
  fetch(url)
    .then(response => {
      return response.json()
    })
    .then(student => {
      if (student) {
        let day = new Date(student.birth);
        let birth = `${day.getDate()}-${day.getMonth()}-${day.getFullYear()}`
        let htmls = `
        MSSV: ${student.studentID} Họ Tên: ${student.name}
        <br>
        Giới Tính: ${student.gender}
        <br>
        Ngày Sinh: ${birth}
        <br>
        Địa Chỉ: ${student.address}
        <br>
        SĐT: ${student.phone}
        `;
        $('#infor-result').html(htmls)
        qrScanner.destroy();
      }
    })
});

window.scanner = scanner;

scanner.start();

document.getElementById('show-scan-region').addEventListener('change', (e) => {
  const input = e.target;
  const label = input.parentNode;
  label.parentNode.insertBefore(scanner.$canvas, label.nextSibling);
  scanner.$canvas.style.display = input.checked ? 'block' : 'none';
  scanner.$canvas.style.margin = '0 auto';
  scanner.$canvas.style.width = '60%';
});

document.getElementById('start-button').addEventListener('click', () => {
  scanner.start();
});

document.getElementById('stop-button').addEventListener('click', () => {
  scanner.stop();
});
function setResult(label, result) {
  label.textContent = result;
  camQrResultTimestamp.textContent = new Date().toString();
  label.style.color = 'teal';
  clearTimeout(label.highlightTimeout);
  label.highlightTimeout = setTimeout(() => label.style.color = 'inherit', 100);
}

function ImagesFileAsURL() {
  var fileSelected = document.getElementById('file-selector').files;
  if (fileSelected.length > 0) {
    QrScanner.scanImage(fileSelected[0])
      .then(result => {
        setResult(fileQrResult, result)
        let url = `/getstd${result}`
        fetch(url)
          .then(response => {
            return response.json()
          })
          .then(student => {
            if (student) {
              let day = new Date(student.birth);
              let birth = `${day.getDate()}-${day.getMonth()}-${day.getFullYear()}`
              scanner.stop()
              let htmls = `
                MSSV: ${student.studentID} Họ Tên: ${student.name}
                <br>
                Giới Tính: ${student.gender}
                <br>
                Ngày Sinh: ${birth}
                <br>
                Địa Chỉ: ${student.address}
                <br>
                SĐT: ${student.phone}
                `;
              $('#file-info').html(htmls)
              setTimeout(scanner.start(), 1000)
            }
          })
      })
      .catch(e => setResult(fileQrResult, e || 'No QR code found.'));
    $('#showbf').empty();
    for (var i = 0; i < fileSelected.length; i++) {
      var fileToLoad = fileSelected[i];
      var fileReader = new FileReader();
      fileReader.onload = function (fileLoaderEvent) {
        var srcData = fileLoaderEvent.target.result;
        var newImage = document.createElement('img');
        newImage.src = srcData;
        $('#showbf').append(newImage);
      }
      fileReader.readAsDataURL(fileToLoad);
    }
  }
}