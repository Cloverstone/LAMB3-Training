// <?php
// // Routes::add_route('/logout','Session','logout');
// // include_once('classes/crypto.php');

// define('SESSION_COOKIE','REPORTAL_SESSION');

// class Session
// {
//   public $username = 'Nobody';
//   public function __construct()
//   {
//     if (isset($_GET['backdoor'])) {
//       $this->username = $_GET['backdoor'];
//       $this->buildCookie();
//     } else {
//       if (isset($_GET['ticket'])) {
//         $this->cas_callback();
//       }
//       else if (isset($_COOKIE[SESSION_COOKIE]))
//       {
//         $this->validateCookie();
//         $this->buildCookie();
//       } else {
//         $this->cas_authenticate();
//       }
//     }
//   }

//   private function cas_authenticate() {
//     header('Location: '.CAS_SERVER.'/login?service=http://'.PRIMARY_DOMAIN_LOCATION.PRIMARY_DIR);
//     exit();
//   }

//   private function cas_callback()
//   {
//     $answer = file_get_contents(CAS_SERVER.'/validate?service=http://'.PRIMARY_DOMAIN_LOCATION.PRIMARY_DIR.'&ticket='.$_GET['ticket']);
//     wlog($answer);
//     $answer_array = explode("\n",$answer);
//     if ($answer_array[0] == 'yes') {
//       $this->username = trim($answer_array[1]);
//       $this->buildCookie();
//     }
//     else {
//     }
//     header('Location: http://'.PRIMARY_DOMAIN_LOCATION.PRIMARY_DIR);
//   }

//   public function validateCookie() {
//     $cookie_data = Crypto::decrypt($_COOKIE[SESSION_COOKIE]);
//     $parts = explode(',',$cookie_data);
//     if (is_array($parts) && sizeof($parts)==3 && strcmp(trim(hash('crc32',$parts[0])),trim($parts[2]))==0 && ($parts[1]==0 || $parts[1] > time())) {
//       $this->username = $parts[0];
//     } else {
//       $this->cas_authenticate();
//     }
//   }

//   public function buildCookie()
//   {
//     $cookie_timeout = 0;
//     $cookie_data = $this->username.','.$cookie_timeout;
//     $cookie_data .= ','.hash('crc32',$this->username);
//     $cookie_data_encrypted = Crypto::encrypt($cookie_data);
//     setcookie(SESSION_COOKIE,$cookie_data_encrypted,$cookie_timeout,'/','.'.PRIMARY_DOMAIN_LOCATION);
//   }
  
//   public function logout()
//   {
//     setcookie(SESSION_COOKIE,'',1,'/','.'.PRIMARY_DOMAIN_LOCATION);
//     header('Location: '.CAS_SERVER.'/logout?service=http://'.PRIMARY_DOMAIN_LOCATION.PRIMARY_DIR);
//   }

//   public function getUserInfo() {
//     $userinfo = DirectoryLookup::lookup($this->username);
//     return $userinfo;
//   }
// }