import React, { useState, useEffect } from 'react';
import '../styles/JournalPage.css';
import HeaderStudent from '../components/HeaderStudent';
import { MdClose } from 'react-icons/md';
import {
  getJournalEntries,
  addJournalEntry,
  updateJournalEntry,
  deleteJournalEntry
} from '../services/api';

import { useAuth } from '../AuthContext';

const JournalPage = () => {

  const { userData, authToken } = useAuth();

  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [entryToUpdate, setEntryToUpdate] = useState(null);

  const toggleEntryClass = (e) => {
    const entryElement = e.currentTarget.closest('.journal-entry');
    if (entryElement) {
      entryElement.classList.add('journal-entry-on-click');
    }
  };

  const closeEntry = (e) => {
    e.stopPropagation(); // Prevent the click from toggling the entry
    const entryElement = e.currentTarget.closest('.journal-entry');
    if (entryElement) {
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
                <div className="entry-text">
                  {isUpdating && entryToUpdate?.id === entry._id ? (
                    <textarea
                      value={entryToUpdate.text}
                      onChange={(e) => setEntryToUpdate({ ...entryToUpdate, text: e.target.value })}
                    />
                  ) : (
                    entry.note
                  )}
                </div>
                {isUpdating && entryToUpdate?.id === entry._id ? (
                  <button onClick={handleUpdateEntry}>Save</button>
                ) : (
                  <button onClick={(e) => handleUpdateButton(entry._id, entry.note, e)}>Update</button>
                )}
                <button onClick={(e) => {
                  handleDeleteEntry(entry._id);
                  closeEntry(e);
                }}>Delete</button>
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
          {isUpdating ? <button onClick={handleUpdateEntry}>Update</button> : <button onClick={handleAddEntry}>Add New Entry</button>}
        </section>
      </main>
    </div>
  );
};

export default JournalPage;