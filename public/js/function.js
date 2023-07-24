var videoActive;
var func = {
  init: ({ initializeApp, getFirestore, collection, getDocs, query, where, getAuth, GoogleAuthProvider, signInWithPopup, signOut }) => {
    const firebaseConfig = {
      apiKey: "AIzaSyCDq52WMJbyRxa_w6VWx8JyXNLO5LM2D9U",
      authDomain: "login-8d4bd.firebaseapp.com",
      projectId: "login-8d4bd",
      storageBucket: "login-8d4bd.appspot.com",
      messagingSenderId: "1063185419993",
      appId: "1:1063185419993:web:92c3062df9bf97f21e78c8",
      measurementId: "G-SVF9VMWBWM"
    };
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const auth = getAuth();
    const db = getFirestore(app);
    // Get a list of cities from your database
    auth.onAuthStateChanged(async (user) => {
      setTimeout(() => {
        (function(d, s, id, t) {
          if (d.getElementById(id)) return;
          var js, fjs = d.getElementsByTagName(s)[0];
          js = d.createElement(s);
          js.id = id;
          js.src = 'https://widget.oncustomer.asia/js/index.js?token=' + t;
          fjs.parentNode.insertBefore(js, fjs);}
        (document, 'script', 'oc-chat-widget-bootstrap', '2f489c6d8237c36cc64c42b95e755250'));


        window.OnCustomer.init({
          userId: user?.uid, // Bắt buộc
          email: user?.emain,
          // phone: '',
          firstName: user?.displayName,
          lastName: user?.displayName,
        })
      }, 3000);
      if (user?.email) {

        const userRef = collection(db, 'user-registed');
        const q = query(userRef, where('email', '==', user?.email));
        const docSnap = await getDocs(q);
        func.getUserRegisted({ docSnap }, user, () => {
          func.selectLesson(sessionStorage.getItem('selected') || 1, true);
          document.getElementById('user-avatar').src = user?.photoURL;
          document.getElementById('user-name').innerHTML = user?.displayName;
          func.initCreateWeb();
          sessionStorage.setItem('userInfo', JSON.stringify(user));
        });
        setTimeout(() => {
          if (document.getElementById('signOutWithGoogle')) {
            document.getElementById('signOutWithGoogle').addEventListener('click', signOutWithGoogle);
          }
        }, 1000)
      } else {
        let htmlBody = `
        <div class="login-box">
          <div class="card card-outline card-primary">
          <div class="card-header text-center">
            <h3>Đăng nhập tài liệu</h3>
          </div>
          <div class="card-body">
          <p class="login-box-msg">
            Dùng tài khoản google thường dùng để chúng tôi có thể hỗ trợ bạn tốt hơn
          </p>
          <div class="input-group mb-3">
            <button id="signInWithGoogle">Login with your Google
              <img src="./img/google.svg" width="55px" height="55px" alt="Sign in with your Google account.">
            </button><br>
          </div>
          </div>
          </div>
          `;
        document.getElementById('body-content').innerHTML = htmlBody;
        setTimeout(() => {
          if (document.getElementById('signInWithGoogle')) {
            document.getElementById('signInWithGoogle').addEventListener('click', signInWithGoogle);
            document.getElementById('signOutWithGoogle').addEventListener('click', signOutWithGoogle);
          }
        }, 1000);
      }

    });
    const signInWithGoogle = () => {
      const googleProvider = new GoogleAuthProvider();
      googleProvider.addScope('profile');
      googleProvider.addScope('email');
      signInWithPopup(auth, googleProvider)
        .then(() => {
          window.location.reload();
        })
        .catch(error => {
          console.error(error);
        })
    }
    const signOutWithGoogle = () => {
      signOut(auth)
        .then(() => {
          window.location.reload();
        })
        .catch(error => {
          console.error(error);
        })
    }
  },
  initCreateWeb: () => {
    let objWebDefault = {
      website: 'lamweb2h.com',
      email: 'lamweb2h@gmail.com',
      username: 'lamweb2h',
      password: 'lamweb2h5@R',
      ssl: 'true',
    }
    if (sessionStorage.getItem('objWeb')) {
      objWebDefault = JSON.parse(sessionStorage.getItem('objWeb'));
      console.log({objWebDefault})
    }
    if (!document.getElementById('website')) {
      return;
    }
    let website = document.getElementById('website');
    let email = document.getElementById('email');
    let username = document.getElementById('username');
    let password = document.getElementById('password');
    let ssl = document.getElementById('ssl');
    website.value = objWebDefault.website;
    email.value = objWebDefault.email;
    username.value = objWebDefault.username;
    password.value = objWebDefault.password;
    ssl.checked = objWebDefault?.ssl;
  },
  getUserRegisted: ({ docSnap }, user, cb) => {
    let htmlBody = '';
    docSnap.forEach((doc) => {
      if (doc) {
        htmlBody = `<div class="wrapper">
  <nav class="main-header navbar navbar-expand navbar-white navbar-light">
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
      </li>
    </ul>
    <ul class="navbar-nav ml-auto">
      <li class="nav-item">
        <a id='signOutWithGoogle' class="nav-link" data-widget="control-sidebar" data-slide="true" href="#" role="button">
          Đăng xuất
        </a>
      </li>
    </ul>
  </nav>
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <a href="#" class="brand-link elevation-4">
      <img id='user-avatar' alt="" class="brand-image img-circle elevation-3" style="opacity: .8">
      <span class="brand-text font-weight-light" id="user-name">---</span>
    </a>
    <div class="sidebar">
      <nav class="mt-2">
        <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
          <li class="nav-header">Module</li>
          <div id='sidebar-lesson'></div>
        </ul>
      </nav>
    </div>
  </aside>

  <div class="content-wrapper">
    <section class="content mt-10">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <strong id='title-lesson'>---</strong>
              </div>
              <div class="row">
              <div class="col-md-9">
              <div class="card-body" id='content-lesson'>
              
              </div>
            </div>
              
              <div class="col-md-3" id='call-action-1'>

</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <footer class="main-footer">
    <div class="float-right d-none d-sm-block">
      <b>Version</b> 3.2.0
    </div>
  </footer>
</div>`;
      } else {
        htmlBody = 'Tài khoản của bạn chưa được thanh toán'
      }
      document.getElementById('body-content').innerHTML = htmlBody;
      cb();
    });
    if (docSnap.size === 0) {
      htmlBody = `<div id='payment-page' align="center">
        <div class='col-md-4 mt-3' >
        <div class="card card-primary card-outline">
          <div class="card-body box-profile">
          <div class="text-center">
          <img class="profile-user-img img-fluid img-circle" src="${user?.photoURL}" alt="User profile picture">
          </div>
          <h3 class="profile-username text-center">${user?.displayName}</h3>
          <p class="text-muted">Người dùng</p>
          <h4><i class="fas fa-exclamation-triangle text-warning"></i> Oops! Bạn chưa thanh toán, vui lòng thanh toán để nhận ưu đãi.</h4>
          <a href="#" class="btn btn-primary btn-block"><b>Thanh toán ngay</b></a>
          </div>
          </div>
        </div>
        </div>`;
      document.getElementById('body-content').innerHTML = htmlBody;
    }
    return docSnap;
  },
  CopyToClipboard: (containerid) => {
    var r = document.createRange();
    r.selectNode(document.getElementById(containerid));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(r);
    try {
      document.execCommand('copy');
      window.getSelection().removeAllRanges();
      $('#' + containerid).parent().notify('Sao chép lệnh thành công', 'success', {
        position: "right"
      });
    } catch (err) {
      $('#' + containerid).parent().notify('Có lỗi sao chép', 'warn', {
        position: "right"
      });
    }
  },
  selectLesson: (id, loaded = false) => {
    if (!loaded && sessionStorage.getItem('selected') == id) {
      return;
    }
    let lesson = lessons.find(l => l.id == id);
    sessionStorage.setItem('selected', id || '1');
    document.getElementById('content-lesson').innerHTML = lesson?.description;
    document.getElementById('title-lesson').innerHTML = lesson?.title;
    func.renderSidebar(id);
    if (lesson.type !== 'video') {
      return;
    }
    videoActive?.dispose();
    const infoVideos = [{ "label": "360P", "src": lesson.video, "res": 720 }];
    const options = {
      // nativeControlsForTouch: true,
      controls: true,
      sources: infoVideos,
      playbackRates: [0.5, 1, 1.3, 1.5, 2, 4],
      fluid: true,
      // autoplay: true,
    };
    videoActive = videojs('video-js' + id, options);
    videoActive.playbackRate(1.3);
    let timeVideo1 = setInterval(() => {
      let myVideo = videoActive.currentTime();
      let totalTime = videoActive.duration();
      let percentTime = (myVideo * 100) / totalTime;
      if (percentTime >= 90 && $('.vjs-fullscreen-control').attr('title') === 'Exit Fullscreen') {
        $('.vjs-fullscreen-control').trigger('click');
        clearInterval(timeVideo1);
      }
    }, 1000);
    let timeVideo = setInterval(() => {
      let myVideo = videoActive.currentTime();
      let totalTime = videoActive.duration();
      let percentTime = (myVideo * 100) / totalTime;
    if (percentTime >= 80) {
      let user = JSON.parse(sessionStorage.getItem('userInfo'));
      let htmlCallAction = `<div class="card card-danger">
      <div class="card-header">
      <h3 class="card-title">Chào <strong>${user?.displayName}</strong></h3>
      <div class="card-tools">
      <button type="button" class="btn btn-tool" data-card-widget="remove"><i class="fas fa-times"></i>
      </button>
      </div>
      </div>
      <div class='col-md-12'>
      
      <div class="text-center">
      <img class="profile-user-img img-fluid img-circle mt-1" src="https://zinson.vn/wp-content/uploads/2023/07/323574724_1361808437920482_5469477596232757081_n.jpg" id='avatar-call-caction' alt="">
      </div>
      <h3 class="profile-username text-center">Duy Phạm</h3>
      <p class="text-muted text-center">Software Engineer</p>
<p>
Mình là Duy, cảm ơn ${user?.displayName} đã đăng ký khóa học này,
${user?.displayName} cứ follow hết các bước là sẽ làm được 1 website bạn hàng
như ý muốn của mình nhé, mình sẽ cập nhật liên tục các tính năng plugin để tăng tỷ lệ chuyển đổi
dễ bán hàng hơn cho website của bạn, Nếu ${user?.displayName} muốn cài đặt nhanh hơn thì
có thể trao đổi trực tiếp 1:1 với mình nhé. cảm ơn ${user?.displayName}.
</p>

<strong class="card-warning">QUYỀN LỢI HỖ TRỢ 1:1</strong>
<br>
<span>Teamview hỗ trợ, chỉ tay trực tiếp làm website đến khi hoàn thành thì thôi</span>
<hr style='margin-top: 2px; margin-bottom: 2px;'>
<span>Được chọn tùy ý các ngành nghề trong các giao diện dưới đây</span>
<hr style='margin-top: 2px; margin-bottom: 2px;'>
<span>Hỗ trợ cài plugin, quản lý database</span>
<hr style='margin-top: 2px; margin-bottom: 2px;'>
<span>Tư vấn cách triển khai bán hàng online khi mới bắt đầu</span>
</div>
<div class='card-footer'>
<a href="javascript:void(0);" onclick='func.callContact()' class="btn btn-danger btn-block"><b>Liên hệ với mình</b></a>
</div>

      </div>
      </div>
    
      `;
      document.getElementById('call-action-1').innerHTML = htmlCallAction;
      clearInterval(timeVideo);
    }
    }, 1000);
  },
  callContact: () => {
    window.OnCustomer.showMessage('Chào bạn, mình muốn liên hệ để nhờ hỗ trợ 1:1 trực tiếp');
  },
  renderSidebar: (id) => {
    let lessonItem = '';
    for (let i = 0; i < lessons.length; i++) {
      const itemL = lessons[i];
      lessonItem += `<li class="nav-item">
            <a href="#" onclick='func.selectLesson(${itemL.id})' class="nav-link ${sessionStorage.getItem('selected') == itemL.id ? 'active' : ''}">
              <i class="fa fa-window-restore" aria-hidden="true"></i>
              <p>${itemL.sidebar}</p>
            </a>
          </li>`;
      document.getElementById('sidebar-lesson').innerHTML = lessonItem;
    }
    func.initCreateWeb();
  },
  submitTool: () => {
    let website = document.getElementById('website').value;
    let email = document.getElementById('email').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let ssl = document.getElementById('ssl').checked;
    const regexWebsite = /^[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const regexPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const regexUsername = /^[a-zA-Z0-9]{5,}$/;
    if (!regexWebsite.test(website)) {
      $('#website').notify('Hãy nhập website đúng định dạng VD: bantrasua.com', 'warn', {
        position: "right"
      });
      return;
    }
    if (!regexEmail.test(email)) {
      $('#email').notify('Hãy nhập email đúng định dạng VD: duypham@gmail.com', 'warn', {
        position: "right"
      });
      return;
    }
    if (!regexUsername.test(username)) {
      $('#username').notify('Hãy nhập username đúng định dạng viết liền, in thường, không dấu VD: phamvanduy', 'warn', {
        position: "right"
      });
      return;
    }
    if (!regexPass.test(password)) {
      $('#password').notify('Hãy nhập bao gồm chữ thường, chữ hoa, số, ký tự đặc biệt VD: duypham5@B', 'warn', {
        position: "right"
      });
      return;
    }
    let objWeb = {
      website,
      email,
      username,
      password,
      ssl,
    };

    sessionStorage.setItem('objWeb', JSON.stringify(objWeb));
    let string = `ee site create ${website} --php=7.4 --type=wp --cache ${ssl ? '--ssl=le' : ''} --admin-email=${email} --admin-user=${username} --admin-pass=${password}`;
    document.getElementById('code-build-web').innerHTML = `
    <pre><code class="language-plaintext" id="install-web">${string}</code> <span onclick="func.CopyToClipboard('install-web')">Copy</span></pre>
    `;
    $.notify('Thành công, hãy copy đoạn mã bên dưới đến hoàn thành tạo website', 'success', {
      position: "center"
    });
  }
}

