// import { useEffect, useState } from 'react';
// import { notification } from 'antd';

// const [api, contextHolder] = notification.useNotification();

// const openNotification = () => {
//   api.open({
//     message: 'New Version Released',
//     description: 'Refresh the page to get the latest version.',
//     duration: 0,
//   });
// };

// const LatestVersionChecker = () => {
//   const [latestVersion, setLatestVersion] = useState('');

//   useEffect(() => {
//     // Function to fetch the latest version from GitHub API
//     const fetchLatestVersion = () => {
//       const url = "https://api.github.com/repos/luoyeETH/MyWalletScan/commits?per_page=1";
//       fetch(url)
//         .then(res => res.json())
//         .then(res => {
//           const version = res[0].sha;
//           setLatestVersion(version);
//           localStorage.setItem('version', version);
//         })
//         .catch(error => {
//           console.error('Error fetching latest version:', error);
//         });
//     };

//     // Fetch the latest version on component mount
//     fetchLatestVersion();

//     // Schedule fetching the latest version every 1 hour (you can adjust the interval as needed)
//     const interval = setInterval(fetchLatestVersion, 3600000);

//     // Clean up the interval on component unmount
//     return () => clearInterval(interval);
//   }, []);

//   // Function to compare the latest version with the locally stored version
//   const checkVersion = () => {
//     const locallyStoredVersion = localStorage.getItem('version');
//     if (locallyStoredVersion && locallyStoredVersion !== latestVersion) {
//       // Perform actions when a new version is available
//       openNotification(); // Display the notification when a new version is available
//     }
//   };

//   // Call the checkVersion function on component mount and whenever the latestVersion state changes
//   useEffect(checkVersion, [latestVersion]);

//   return (
//     <div>
//       {contextHolder}
//     </div>
//   );
// };

// export default LatestVersionChecker;
