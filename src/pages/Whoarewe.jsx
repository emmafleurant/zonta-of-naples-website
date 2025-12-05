import React from "react";

export default function Whoarewe() {
  const officers = [
    {
      name: "Jane Doe",
      title: "CEO & Founder",
      img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      desc: "Some text that describes me lorem ipsum ipsum lorem.",
      email: "example@example.com",
    },
    {
      name: "Mike Ross",
      title: "Art Director",
      img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      desc: "Some text that describes me lorem ipsum ipsum lorem.",
      email: "example@example.com",
    },
    {
      name: "John Doe",
      title: "Designer",
      img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      desc: "Some text that describes me lorem ipsum ipsum lorem.",
      email: "example@example.com",
    },
  ];

  const chairs = [
    {
      name: "Alice Smith",
      title: "Committee Chair",
      img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      desc: "Some text about Alice.",
      email: "alice@example.com",
    },
    {
      name: "Bob Johnson",
      title: "Committee Chair",
      img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      desc: "Some text about Bob.",
      email: "bob@example.com",
    },
    {
      name: "Carol White",
      title: "Committee Chair",
      img: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      desc: "Some text about Carol.",
      email: "carol@example.com",
    },
  ];

  return (
    <>
      <div className="who-section">
        <div>
          <h1>Who Are We</h1>
          <p>
            We are the Zonta Club of Naples, dedicated to empowering women
            through service and advocacy.
          </p>
        </div>

        <h1>Officers and Board of Directors</h1>
        <div className="cards-scroll" aria-label="Officers list">
          {officers.map((person, i) => (
            <div className="card" key={i}>
              <img src={person.img} alt={person.name} />
              <div className="content">
                <h2 style={{ margin: 0 }}>{person.name}</h2>
                <p className="title">{person.title}</p>
                <p style={{ margin: 0 }}>{person.desc}</p>
                <p className="email">{person.email}</p>
                <div style={{ marginTop: "auto" }}>
                  <button
                    className="button"
                    onClick={() => (window.location = `mailto:${person.email}`)}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h1 style={{ marginTop: 24 }}>Committee Chairs</h1>
        <div className="cards-scroll" aria-label="Committee chairs list">
          {chairs.map((person, i) => (
            <div className="card" key={i}>
              <img src={person.img} alt={person.name} />
              <div className="content">
                <h2 style={{ margin: 0 }}>{person.name}</h2>
                <p className="title">{person.title}</p>
                <p style={{ margin: 0 }}>{person.desc}</p>
                <p className="email">{person.email}</p>
                <div style={{ marginTop: "auto" }}>
                  <button
                    className="button"
                    onClick={() => (window.location = `mailto:${person.email}`)}
                  >
                    Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

