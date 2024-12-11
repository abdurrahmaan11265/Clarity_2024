import React, { useState, useEffect } from 'react';
import '../styles/JournalPage.css';
import HeaderStudent from '../components/HeaderStudent';
import { MdClose } from 'react-icons/md';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import { LuSaveAll } from "react-icons/lu";
import {
  getJournalEntries,
  addJournalEntry,
  updateJournalEntry,
  deleteJournalEntry
} from '../services/api';

import { useAuth } from '../AuthContext';
import CurveChart from '../components/CurveChart';
import BarChart from '../components/BarChart';

const JournalPage = () => {

  const { userData, authToken } = useAuth();

  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [entryToUpdate, setEntryToUpdate] = useState(null);

  const xAxisData = ['January', 'February', 'March', 'April', 'May', 'June'];
  const yAxisData = [30, 45, 28, 60, 80, 95];
  const xAxisData1 = ['Red', 'Green']; // X-axis labels for the two bars
  const yAxisData1 = [65, 15];

  const toggleEntryClass = (e) => {
    const entryElement = e.currentTarget.closest('.journal-entry');
  
    if (entryElement) {
      entryElement.classList.add('journal-entry-on-click');
      const statsSections = document.body.querySelectorAll('.journal-analytics');
      console.log(statsSections);
      if (statsSections) {
        statsSections.forEach((statsSection) => {
          statsSection.style.display = 'flex';
        });
      }
    }
  };

  const closeEntry = (e) => {
    e.stopPropagation();
    handleUpdateEntry();
    const entryElement = e.currentTarget.closest('.journal-entry');
    const statsSections = document.body.querySelectorAll('.journal-analytics');
    if (entryElement) {
      statsSections.forEach((statsSection) => {
        statsSection.style.display = 'none';
      });
      entryElement.classList.remove('journal-entry-on-click');
    }
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const data = await getJournalEntries(userData._id, authToken);
        setEntries(data);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };
    fetchEntries();
  }, [userData._id, authToken]);

  const handleAddEntry = async () => {
    if (newEntry.trim() !== '') {
      try {
        const response = await addJournalEntry(userData._id, newEntry, authToken);
        setNewEntry('');
        setEntries(response.journalEntries);
      } catch (error){
        console.error("Error adding journal entry:", error);
      }
    }
  };

  const handleUpdateButton = (entryId, currentText, e) => {
   
    setIsUpdating(true);
    setEntryToUpdate({ id: entryId, text: currentText });
    // closeEntry(e);
  };

  const handleUpdateEntry = async () => {
    if (entryToUpdate && entryToUpdate.text.trim() !== '') {
      try {
        const response = await updateJournalEntry(userData._id, entryToUpdate.id, entryToUpdate.text, authToken);
        setEntries(response.journalEntries);
        setIsUpdating(false);
        setEntryToUpdate(null);
      } catch (error) {
        console.error("Error updating journal entry:", error);
      }
    }
  };

  const handleDeleteEntry = async (entryId) => {
    try {
      const response = await deleteJournalEntry(userData._id, entryId, authToken);
      setEntries(response.journalEntries);
    } catch (error) {
      console.error("Error deleting journal entry:", error);
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
              <div key={entry._id} className="journal-entry" onClick={toggleEntryClass}>
                <div className="entry-date">
                  <div className='entry-date-datename'>{entry.date.split('T')[0]}</div>
                  <div className='close-button-entry-date' onClick={closeEntry}>
                    <MdClose size={24} color="white" />
                  </div>
                </div>
                <div className='two-section-of-journal'>
                  <div className='entry-text-and-button-container'>
                  <div className="entry-text">
                    {isUpdating && entryToUpdate?.id === entry._id ? (
                      <textarea rows={10}
                        value={entryToUpdate.text}
                        onChange={(e) => setEntryToUpdate({ ...entryToUpdate, text: e.target.value })}
                      />
                    ) : (
                      entry.note
                    )}
                  </div>
                  <div className='buttons-journal-entries'>
                  {isUpdating && entryToUpdate?.id === entry._id ? (
                    <button className='save-button-journal' onClick={() => {
                      handleUpdateEntry();
                    }}><LuSaveAll /></button>
                  ) : (
                    
                    <button className='edit-button-journal' onClick={(e) => handleUpdateButton(entry._id, entry.note, e)}><MdOutlineModeEditOutline /></button>
                  )}
                  <button className='delete-button-journal' onClick={(e) => {
                    handleDeleteEntry(entry._id);
                    closeEntry(e);
                  }}><MdDeleteSweep /></button>
                  </div>
                  </div>
                  <div className='journal-analytics' style={{textAlign:'center'}}>
                    <h2>Emotional Statistics</h2>
                    <CurveChart xData={xAxisData} yData={yAxisData} />
                    <BarChart xData={xAxisData1} yData={yAxisData1} />
                    <div className='Theme_container'>
                    <h4 style={{marginBottom:'10px'}}>Theme:</h4>
                    <p>A journal is a sacred space where thoughts, emotions, and experiences are poured onto the page, creating a tangible record of one's inner world.</p>
                    </div>

                  </div>
                </div>
              </div>
              
            ))}
          </div>
        </aside>
        <section className="new-entry-section">
          <h2>New Entry</h2>
          <textarea
            rows={10}
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
            placeholder="Write your new journal entry here..."
          />
          {isUpdating ? <button onClick={handleUpdateEntry}>Update</button> : <button onClick={handleAddEntry}>Add New Entry</button>}
        </section>
      </main>
    </div>
  );
};

export default JournalPage;