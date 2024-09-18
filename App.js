import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h1>A heading here</h1>
        <p>Posted by John Doe</p>
      </header>
      <aside className="left">
        <h2>달력</h2>
        <div className="calendar">
          <div className="calendar-header">
            <button id="prev-month">{`<`}</button>
            <span id="month-year" />
            <button id="next-month">{`>`}</button>
          </div>
          <table className="calendar-table">
            <thead>
              <tr>
                <th>일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
              </tr>
            </thead>
            <tbody id="calendar-body" />
          </table>
        </div>
        <button id="show-form-btn">대여하기</button>
      </aside>
      <main>
        <h2>노트북 대여 현황</h2>
        <div className="laptop-status">
          <table className="a">
            <tbody>
              <tr>
                <td className="available" data-id="pc01" id="pc01">PC01</td>
                <td className="available" data-id="pc02" id="pc02">PC02</td>
                <td className="available" data-id="pc03" id="pc03">PC03</td>
                <td className="available" data-id="pc04" id="pc04">PC04</td>
              </tr>
              <tr>
                <td className="available" data-id="pc05" id="pc05">PC05</td>
                <td className="available" data-id="pc06" id="pc06">PC06</td>
                <td className="available" data-id="pc07" id="pc07">PC07</td>
                <td className="available" data-id="pc08" id="pc08">PC08</td>
              </tr>
              <tr>
                <td className="available" data-id="pc09" id="pc09">PC09</td>
                <td className="available" data-id="pc10" id="pc10">PC10</td>
                <td className="available" data-id="pc11" id="pc11">PC11</td>
                <td className="available" data-id="pc12" id="pc12">PC12</td>
              </tr>
              <tr>
                <td className="available" data-id="pc13" id="pc13">PC13</td>
                <td className="available" data-id="pc14" id="pc14">PC14</td>
                <td className="available" data-id="pc15" id="pc15">PC15</td>
                <td className="available" data-id="pc16" id="pc16">PC16</td>
              </tr>
              <tr>
                <td className="available" data-id="pc17" id="pc17">PC17</td>
                <td className="available" data-id="pc18" id="pc18">PC18</td>
                <td className="available" data-id="pc19" id="pc19">PC19</td>
                <td className="available" data-id="pc20" id="pc20">PC20</td>
              </tr>
              <tr>
                <td className="available" data-id="pc21" id="pc21">PC21</td>
                <td className="available" data-id="pc22" id="pc22">PC22</td>
                <td className="available" data-id="pc23" id="pc23">PC23</td>
                <td className="available" data-id="pc24" id="pc24">PC24</td>
              </tr>
              <tr>
                <td className="available" data-id="pc25" id="pc25">PC25</td>
                <td className="available" data-id="pc26" id="pc26">PC26</td>
                <td className="available" data-id="pc27" id="pc27">PC27</td>
                <td className="available" data-id="pc28" id="pc28">PC28</td>
              </tr>
              <tr>
                <td className="available" data-id="pc29" id="pc29">PC29</td>
                <td className="available" data-id="pc30" id="pc30">PC30</td>
                <td className="available" data-id="pc31" id="pc31">PC31</td>
                <td className="available" data-id="pc32" id="pc32">PC32</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="form-container hidden" id="form-container">
          <h2>노트북 대여 정보 입력</h2>
          <form id="rental-form">
            <div className="form-group">
              <label htmlFor="teacher">담당 교사:</label>
              <input id="teacher" name="teacher" required type="text" />
            </div>
            <div className="form-group">
              <label htmlFor="subject">과목:</label>
              <input id="subject" name="subject" required type="text" />
            </div>
            <div className="form-group">
              <label>노트북 번호:</label>
              <div className="checkbox-group" id="laptop-number" />
            </div>
            <div className="form-group">
              <label>이용 시간:</label>
              <div className="checkbox-group" id="rental-duration">
                <label>
                  <input defaultValue="m" name="rental-duration" type="checkbox" />
                  아침시간
                </label>
                <label>
                  <input defaultValue="1" name="rental-duration" type="checkbox" />
                  1교시
                </label>
                <label>
                  <input defaultValue="2" name="rental-duration" type="checkbox" />
                  2교시
                </label>
                <label>
                  <input defaultValue="3" name="rental-duration" type="checkbox" />
                  3교시
                </label>
                <label>
                  <input defaultValue="4" name="rental-duration" type="checkbox" />
                  4교시
                </label>
                <label>
                  <input defaultValue="l" name="rental-duration" type="checkbox" />
                  점심시간
                </label>
                <label>
                  <input defaultValue="5" name="rental-duration" type="checkbox" />
                  5교시
                </label>
                <label>
                  <input defaultValue="6" name="rental-duration" type="checkbox" />
                  6교시
                </label>
                <label>
                  <input defaultValue="7" name="rental-duration" type="checkbox" />
                  7교시
                </label>
                <label>
                  <input defaultValue="8" name="rental-duration" type="checkbox" />
                  8교시
                </label>
                <label>
                  <input defaultValue="d" name="rental-duration" type="checkbox" />
                  석식시간
                </label>
                <label>
                  <input defaultValue="s" name="rental-duration" type="checkbox" />
                  야자시간
                </label>
              </div>
            </div>
            <button className="submit-btn" type="submit">대여하기</button>
          </form>
        </div>
        <div className="info-modal hidden" id="info-modal">
          <button className="modal-close-btn" id="modal-close-btn">닫기</button>
          <div id="modal-content" />
        </div>
        <div className="modal-overlay" id="modal-overlay" />
      </main>
      <aside className="right">
        <h2>노트북 정보</h2>
        <div className="rented-laptops">
          <div className="rental-info" id="rented-laptops" />
        </div>
      </aside>
      <footer>
        <p>Footer content here</p>
      </footer>
    </div>
  );
}

export default App;
