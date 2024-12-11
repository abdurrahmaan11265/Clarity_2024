import React, { useState, useEffect } from 'react';
import '../styles/JournalPage.css';
import HeaderStudent from '../components/HeaderStudent';
import { MdClose } from 'react-icons/md';
import { MdOutlineModeEditOutline } from "react-icons/md";
import { MdDeleteSweep } from "react-icons/md";
import { LuSaveAll } from "react-icons/lu";
import { useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();
  const studentId = searchParams.get('studentId');

  const toggleEntryClass = (e) => {
    const entryElement = e.currentTarget.closest('.journal-entry');

    if (entryElement) {
      entryElement.classList.add('journal-entry-on-click');
      const statsSections = document.body.querySelectorAll('.journal-analytics');
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
    const fetchEntries = async (studentId) => {
      try {
        const data = await getJournalEntries(studentId, authToken);
        setEntries(data);
      } catch (error) {
        console.error("Error fetching journal entries:", error);
      }
    };
    if (userData.userType === 'student') {
      fetchEntries(userData._id);
    }
    else {
      fetchEntries(studentId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddEntry = async () => {
    if (newEntry.trim() !== '') {
      try {
        const response = await addJournalEntry(userData._id, newEntry, authToken);
        setNewEntry('');
        setEntries(response.journalEntries);
      } catch (error) {
        console.error("Error adding journal entry:", error);
      }
    }
  };

  const handleUpdateButton = (entryId, currentText, e) => {
    setIsUpdating(true);
    setEntryToUpdate({ id: entryId, text: currentText });
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

  const getEmotionsData = (entry) => {
    return Object.values(entry.emotions);
  };

  const getPositivityNegativityData = (entry) => {
    const positivity = entry.positivity;
    const negativity = 100 - positivity;
    return [positivity, negativity];
  };

  return (
    <div className="journal-page">
      <HeaderStudent header_name={"Journal"} />
      <main className="journal-content">
        <aside className="journal-entries">
          <h2>Journal Entries</h2>
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
                    {userData.userType === 'student' && (
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
                    )}
                  </div>
                  <div className='journal-analytics' style={{ textAlign: 'center' }}>
                    <h2>Emotional Statistics</h2>
                    <CurveChart xData={Object.keys(entry.emotions)} yData={getEmotionsData(entry)} />
                    <BarChart xData={['Positivity', 'Negativity']} yData={getPositivityNegativityData(entry)} />
                    <div className='Theme_container'>
                      <h4 style={{ marginBottom: '10px' }}>Theme:</h4>
                      <p>{entry.theme}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
        {userData.userType === 'student' && (
          <section className="new-entry-section">
            <h2>New Entry</h2>
            <div className="notice">
              NOTE: These entries are confidential and are only visible to your counsellor.
            </div>
            <textarea
              rows={10}
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="Write your new journal entry here..."
            />
            {isUpdating ? <button onClick={handleUpdateEntry}>Update</button> : <button onClick={handleAddEntry}>Add New Entry</button>}
          </section>
        )}
      </main>
    </div>
  );
};

export default JournalPage;