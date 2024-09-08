import React, { useState } from 'react';
import './App.css';

// 노트북 상태와 대여 기록을 관리하는 컴포넌트
function App() {
  const initialLaptopStatus = Array.from({ length: 32 }, (_, i) => ({
    id: `pc${i + 1}`,
    status: 'available',
    history: []
  }));
  const [laptops, setLaptops] = useState(initialLaptopStatus);
  const [selectedLaptops, setSelectedLaptops] = useState([]);
  const [rentalForm, setRentalForm] = useState({
    userName: '',
    rentalTimes: [],
    subject: '',
    teacher: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [infoModal, setInfoModal] = useState(null);

  const handleLaptopClick = (id) => {
    const laptop = laptops.find(laptop => laptop.id === id);
    if (laptop.status === 'unavailable') {
      setInfoModal(laptop);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    const updatedLaptops = laptops.map(laptop => {
      if (selectedLaptops.includes(laptop.id)) {
        return {
          ...laptop,
          status: 'unavailable',
          history: [...laptop.history, {
            ...rentalForm,
            returnTime: null
          }]
        };
      }
      return laptop;
    });

    setLaptops(updatedLaptops);
    setSelectedLaptops([]);
    setRentalForm({ userName: '', rentalTimes: [], subject: '', teacher: '' });
    setShowForm(false);
  };

  const handleReturnClick = (id) => {
    const updatedLaptops = laptops.map(laptop => {
      if (laptop.id === id && laptop.status === 'unavailable') {
        const updatedHistory = laptop.history.map(entry =>
          entry.returnTime ? entry : { ...entry, returnTime: new Date().toISOString() }
        );

        return {
          ...laptop,
          status: 'available',
          history: updatedHistory
        };
      }
      return laptop;
    });

    setLaptops(updatedLaptops);
    setInfoModal(null);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    setSelectedLaptops(prevState =>
      checked ? [...prevState, value] : prevState.filter(id => id !== value)
    );
  };

  return (
    <div className="container">
      <div className="laptop-status">
        <h1>노트북 대여 현황</h1>
        <table>
          <thead>
            <tr>
              <th>노트북 ID</th>
              <th>상태</th>
              <th>상세보기</th>
            </tr>
          </thead>
          <tbody>
            {laptops.map(laptop => (
              <tr key={laptop.id}>
                <td>{laptop.id}</td>
                <td className={laptop.status}>
                  {laptop.status === 'available' ? '대여 가능' : '대여 중'}
                </td>
                <td>
                  <button onClick={() => handleLaptopClick(laptop.id)}>
                    {laptop.status === 'unavailable' ? '정보 보기' : '정보 없음'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rented-laptops">
        <h1>대여된 노트북</h1>
        {laptops.filter(laptop => laptop.status === 'unavailable').map(laptop => (
          <div key={laptop.id} className="rental-card">
            <strong>{laptop.id}</strong>
            {laptop.history.map((entry, index) => (
              <div key={index}>
                <p>대여자: {entry.userName}</p>
                <p>대여 시간: {new Date(entry.rentalTimes[0]).toLocaleString()}</p>
                <p>반납 시간: {entry.returnTime ? new Date(entry.returnTime).toLocaleString() : '반납 안됨'}</p>
                <p>과목: {entry.subject}</p>
                <p>교사: {entry.teacher}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <button id="show-form-btn" onClick={() => setShowForm(true)}>
        대여하기
      </button>

      {showForm && (
        <>
          <div className="modal-overlay" onClick={() => setShowForm(false)}></div>
          <div className="form-container">
            <h2>대여 양식</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  value={rentalForm.userName}
                  onChange={(e) => setRentalForm({ ...rentalForm, userName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>대여 시간</label>
                <input
                  type="datetime-local"
                  value={rentalForm.rentalTimes[0] || ''}
                  onChange={(e) => setRentalForm({ ...rentalForm, rentalTimes: [e.target.value] })}
                  required
                />
              </div>
              <div className="form-group">
                <label>과목</label>
                <input
                  type="text"
                  value={rentalForm.subject}
                  onChange={(e) => setRentalForm({ ...rentalForm, subject: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>교사</label>
                <input
                  type="text"
                  value={rentalForm.teacher}
                  onChange={(e) => setRentalForm({ ...rentalForm, teacher: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>대여할 노트북 선택</label>
                <div className="checkbox-group">
                  {laptops.map(laptop => (
                    <label key={laptop.id}>
                      <input
                        type="checkbox"
                        value={laptop.id}
                        checked={selectedLaptops.includes(laptop.id)}
                        onChange={handleCheckboxChange}
                        disabled={laptop.status === 'unavailable'}
                      />
                      {laptop.id}
                    </label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <button type="submit">제출</button>
              </div>
            </form>
          </div>
        </>
      )}

      {infoModal && (
        <>
          <div className="modal-overlay" onClick={() => setInfoModal(null)}></div>
          <div className="info-modal">
            <h2>{infoModal.id} 대여 기록</h2>
            {infoModal.history.map((entry, index) => (
              <div key={index}>
                <p>대여자: {entry.userName}</p>
                <p>대여 시간: {new Date(entry.rentalTimes[0]).toLocaleString()}</p>
                <p>반납 시간: {entry.returnTime ? new Date(entry.returnTime).toLocaleString() : '반납 안됨'}</p>
                <p>과목: {entry.subject}</p>
                <p>교사: {entry.teacher}</p>
                {!entry.returnTime && (
                  <button className="modal-close-btn" onClick={() => handleReturnClick(infoModal.id)}>
                    반납하기
                  </button>
                )}
              </div>
            ))}
            <button className="modal-close-btn" onClick={() => setInfoModal(null)}>닫기</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
