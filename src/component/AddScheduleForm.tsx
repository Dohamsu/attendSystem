import * as React from "react";

interface CategoryProps {
  icon: string;
  label: string;
  color: string;
}

const Category: React.FC<CategoryProps> = ({ icon, label, color }) => (
  <div className={`category ${color}`}>
    <img src={icon} alt={label} className="category-icon" />
    <div className="category-label">{label}</div>
  </div>
);

const categories: CategoryProps[] = [
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/477e3581c6c6b96d42b34277792d3277803fb4277670b188ddb6cf60ec935ab3?apiKey=fffec69be78842fd9cca1f6306b98f34&",
    label: "Brainstorm",
    color: "purple",
  },
  {
    icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/cb10337a78bfe5354884a0cadbbca62d8db650cefc322137b1f8c87af69ece57?apiKey=fffec69be78842fd9cca1f6306b98f34&",
    label: "Workout",
    color: "blue",
  },
];

const MyComponent: React.FC = () => {
  return (
    <>
      <div className="event-form">
        <h2 className="form-title">Add New Event</h2>
        <div className="form-fields">
          <div className="event-name">Event name*</div>
          <div className="event-note">Type the note here...</div>
          <div className="event-date">
            <div className="date-label">Date</div>
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/3e4634b99dfa0d4ca1d31bd7853da323f191c8791769c901e30df739512eba83?apiKey=fffec69be78842fd9cca1f6306b98f34&" alt="Calendar icon" className="date-icon" />
          </div>
          <div className="event-time">
            <div className="start-time">
              <div className="time-label">Start time</div>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/13fa645e95fc4da1eb223e6d387cb7657e7a24a9b5e37ae11d4d967498cdf23b?apiKey=fffec69be78842fd9cca1f6306b98f34&" alt="Clock icon" className="time-icon" />
            </div>
            <div className="reminder">Reminds me</div>
            <div className="category-select">Select Category</div>
            <div className="end-time">
              <div className="time-label">End time</div>
              <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/23feb261b71b3785af391b329ab4cd50653f0b190bc1c286c1c6fcab06f16a69?apiKey=fffec69be78842fd9cca1f6306b98f34&" alt="Clock icon" className="time-icon" />
            </div>
            <div className="toggle-switch">
              <div className="switch-handle" />
            </div>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <Category key={category.label} {...category} />
            ))}
            <img src="https://cdn.builder.io/api/v1/image/assets/TEMP/6d1c9f55e5e90718bca5005ab8f4db229a8fd2366aa5488f14906c6a9cb04f47?apiKey=fffec69be78842fd9cca1f6306b98f34&" alt="Separator" className="separator" />
          </div>
          <div className="add-category">+ Add new</div>
          <button className="create-event">Create Event</button>
        </div>
      </div>
{/* 
      <style jsx>{`
        .event-form {
          border-radius: 32px 32px 0 0;
          box-shadow: 0 3px 30px 0 rgba(0, 0, 0, 0.16);
          background-color: #fff;
          max-width: 390px;
          padding: 33px 0;
        }

        .form-title {
          color: #222b45;
          text-align: center;
          font: 600 20px/110% SF UI Text, -apple-system, Roboto, Helvetica,
            sans-serif;
        }

        .form-fields {
          margin-top: 25px;
          padding: 0 16px;
        }

        .event-name {
          border: 1px solid rgba(237, 241, 247, 1);
          border-radius: 8px;
          color: #8f9bb3;
          padding: 20px 14px;
          font: 400 15px/133% SF UI Text, -apple-system, Roboto, Helvetica,
            sans-serif;
        }

        .event-note {
          border: 1px solid rgba(237, 241, 247, 1);
          border-radius: 8px;
          color: #8f9bb3;
          margin-top: 16px;
          padding: 19px 14px 56px;
          font: 400 15px/133% SF UI Text, -apple-system, Roboto, Helvetica,
            sans-serif;
        }

        .event-date {
          border: 1px solid rgba(237, 241, 247, 1);
          border-radius: 8px;
          color: #8f9bb3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 15px;
          padding: 16px 14px;
          font: 400 15px/133% SF UI Text, -apple-system, Roboto, Helvetica,
            sans-serif;
        }

        .date-label {
          margin: auto 0;
        }

        .date-icon {
          width: 16px;
        }

        .event-time {
          display: flex;
          gap: 14px;
          margin-top: 16px;
        }

        .start-time,
        .end-time {
          border: 1px solid rgba(237, 241, 247, 1);
          border-radius: 8px;
          color: #8f9bb3;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 14px;
          font: 400 15px/133% SF UI Text, -apple-system, Roboto, Helvetica,
            sans-serif;
        }

        .time-label {
          font-family: SF UI Text, sans-serif;
        }

        .time-icon {
          width: 18px;
        }

        .reminder {
          color: #222b45;
          font: 400 14px/136% SF UI Text, -apple-system, Roboto, Helvetica,
            sans-serif;
          margin-top: 20px;
          text-align: right;
        }

        .category-select {
          color: #222b45;
          font: 500 17px/112% SF UI Text, -apple-system, Roboto, Helvetica,
            sans-serif;
          margin-top: 27px;
          text-align: right;
        }

        .toggle-switch {
          background-color: #ced3de;
          border-radius: 13px;
          margin-top: 15px;
          padding: 4px 0;
          width: 44px;
        }

        .switch-handle {
          background-color: #fff;
          border-radius: 50%;
          height: 16px;
          width: 16px;
        }

        .category-list {
          display: flex;
          gap: 16px;
          margin-top: 17px;
          padding: 0 1px;
        }

        .category {
          border-radius: 11px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 16px 13px;
          white-space: nowrap;
        }

        .category.purple {
          background-color: #735bf2;
        }

        .category.blue {
          background-color: #0095ff;
        }

        .category-icon {
          width: 11px;
        }

        .category-label {
          color: #222b45;
          font: 500 14px/121% SF UI Text, -apple-system, Roboto, Helvetica,
            sans-serif;
          letter-spacing: 0.88px;
        }

        .separator {
          width: 94px;
        }

        .add-category {
          color: #735bf2;
          font: 500 14px/121% SF UI Text, -apple-system, Roboto, Helvetica,
            sans-serif;
          letter-spacing: 0.88px;
          margin-top: 13px;
        }

        .create-event {
          background-color: #735bf2;
          border: none;
          border-radius: 7px;
          color: #fff;
          cursor: pointer;
          font: 600 16px/137.5% SF UI Text, -apple-system, Roboto, Helvetica,
            sans-serif;
          margin-top: 24px;
          padding: 19px 60px;
          text-align: center;
          width: 100%;
        }
      `}</style> */}
    </>
  );
};

export default MyComponent;