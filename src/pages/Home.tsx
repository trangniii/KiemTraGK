import { useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Share } from '@capacitor/share';
import { Camera, CameraResultType } from '@capacitor/camera';
import './Home.css';

const TimeDisplay = () => {
  const [currentTime, setCurrentTime] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);

  // Khởi tạo thông báo
  const initNotifications = async () => {
    await LocalNotifications.requestPermissions();
  };

  // Lấy thời gian hiện tại
  const showCurrentTime = async () => {
    try {
      await initNotifications();
      
      const now = new Date();
      const timeString = now.toLocaleTimeString();
      setCurrentTime(timeString);

      // Hiển thị thông báo
      await LocalNotifications.schedule({
        notifications: [
          {
            title: 'Thời gian hiện tại',
            body: timeString,
            id: 1,
            schedule: { at: new Date(Date.now() + 1000) },
            sound: 'default'
          },
        ],
      });

    } catch (error) {
      console.error('Lỗi hiển thị thời gian:', error);
    }
  };

  // Chia sẻ thời gian
  const shareTime = async () => {
    if (!currentTime) {
      alert('Vui lòng hiển thị thời gian trước khi chia sẻ');
      return;
    }

    try {
      await Share.share({
        title: 'Thời gian hiện tại',
        text: `Thời gian hiện tại là: ${currentTime}`,
        dialogTitle: 'Chia sẻ thời gian'
      });
    } catch (error) {
      console.error('Lỗi khi chia sẻ:', error);
    }
  };

  // Chụp ảnh
  const takeScreenshot = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl
      });

      setScreenshot(image.dataUrl || null);
  
    } catch (error) {
      console.error('Lỗi khi chụp ảnh:', error);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Hiển Thị Thời Gian</h1>
        <p className="app-subtitle">Ứng dụng xem giờ địa phương</p>
      </header>

      <main className="time-display-container">
        <button 
          onClick={showCurrentTime}
          className="action-button time-button"
        >
          Hiển Thị Thời Gian
        </button>

        {currentTime && (
          <div className="time-result">
            <p className="time-value">{currentTime}</p>
            
            <div className="action-buttons">
              <button 
                onClick={shareTime}
                className="action-button share-button"
              >
                Chia Sẻ Thời Gian
              </button>
              
              <button 
                onClick={takeScreenshot}
                className="action-button screenshot-button"
              >
                Chụp ảnh
              </button>
            </div>
            
          </div>
        )}

        {screenshot && (
          <div className="screenshot-preview">
            <h3>Ảnh Chụp :</h3>
            <img 
              src={screenshot} 
              alt="Screenshot" 
              className="screenshot-image"
            />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Ứng dụng thiết kế với React và Capacitor</p>
      </footer>
    </div>
  );
};

export default TimeDisplay;