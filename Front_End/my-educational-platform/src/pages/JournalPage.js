import React, { useState } from 'react';
import '../styles/JournalPage.css';
import HeaderStudent from '../components/HeaderStudent';
import { MdClose } from 'react-icons/md';

const JournalPage = () => {
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');

  const addEntry = () => {
    if (newEntry.trim() !== '') {
      setEntries([
        { id: Date.now(), text: newEntry, date: new Date().toLocaleDateString() },
        ...entries
      ]);
      setNewEntry('');
    }
  };

  return (
    <div className="journal-page">
        <HeaderStudent header_name={"Journal"} />
      <main className="journal-content">
        <aside className="journal-entries">
          <h2>Previous Entries</h2>
          <div className="entries-list">
            {entries.map((entry) => (
              <div key={entry.id} className="journal-entry" onClick={
                (e)=>{
                  console.log(e.target.parentElement.className);
                  if(e.target.parentElement.className==="journal-entry"){
                    e.target.parentElement.classList.add("journal-entry-on-click");
                  }
                  else if(e.target.parentElement.parentElement.className==="journal-entry"){
                    e.target.parentElement.parentElement.classList.add("journal-entry-on-click");
                  }
                    
                }
              }>
                <div className="entry-date"><div className='entry-date-datename'>{entry.date} </div> <div className='close-button-entry-date' 
                onClick={

                    (e)=>{
                      console.log(e.target.parentElement.className);
                      console.log(e.target.parentElement.parentElement.parentElement.className);
                      if(e.target.parentElement.parentElement.className==="journal-entry-on-click"){
                        e.target.parentElement.classList.remove("journal-entry-on-click");
                      }
                      else if(e.target.parentElement.parentElement.parentElement.className==="journal-entry journal-entry-on-click"){
                        e.target.parentElement.parentElement.parentElement.classList.remove("journal-entry-on-click");
                      }
                        
                    }
                }


                ><MdClose size={24} color="white" /></div></div>
                <div className="entry-text">{entry.text}</div>
              </div>
            ))}
          </div>
        </aside>
        <section className="new-entry-section">
          <h2>New Entry</h2>
          <textarea
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Write your new journal entry here..."
          />
          <button onClick={addEntry}>Add New Entry</button>
        </section>
      </main>
    </div>
  );
};

export default JournalPage;

