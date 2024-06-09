import React, { useState, useEffect } from 'react';
import './App.css';

interface Post {
    date: string;
    title: string;
    platform: string;
}

interface PopupState {
    show: boolean;
    post: Post | null;
    date: string;
}

const posts: Post[] = [
    { date: '2024-06-19', title: 'LinkedIn Post 1', platform: 'LinkedIn' },
    { date: '2024-06-19', title: 'Instagram Post 1', platform: 'Instagram' }
];

const Calendar: React.FC = () => {
    const currentDate = new Date();
    const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
    const [isWeekView, setIsWeekView] = useState<boolean>(false);
    const [popup, setPopup] = useState<PopupState>({ show: false, post: null, date: '' });

    useEffect(() => {
        renderCalendar();
    }, [selectedDate, isWeekView]);

    const renderCalendar = () => {
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const firstDayIndex = firstDayOfMonth.getDay();
        const lastDayIndex = lastDayOfMonth.getDate();
        
        let calendarCells: JSX.Element[] = [];

        if (isWeekView) {
            const startOfWeek = selectedDate.getDate() - selectedDate.getDay();
            for (let i = 0; i < 7; i++) {
                const date = new Date(selectedDate.setDate(startOfWeek + i));
                calendarCells.push(createDateCell(date, year, month));
            }
        } else {
            for (let i = 0; i < firstDayIndex; i++) {
                calendarCells.push(<div key={`empty-${i}`}></div>);
            }
            
            for (let i = 1; i <= lastDayIndex; i++) {
                const date = new Date(year, month, i);
                calendarCells.push(createDateCell(date, year, month));
            }
        }

        return calendarCells;
    };

    const createDateCell = (date: Date, year: number, month: number) => {
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        
        const postElements = posts.filter(p => p.date === dateStr).map((post, index) => (
            <div key={index} className="post" onClick={() => openPopup(post, dateStr)}>
                {`${post.title} (${post.platform})`}
            </div>
        ));

        return (
            <div key={dateStr}>
                <span className="date">{date.getDate()}</span>
                {postElements}
            </div>
        );
    };

    const openPopup = (post: Post, date: string) => {
        setPopup({ show: true, post, date });
    };

    const closePopup = () => {
        setPopup({ show: false, post: null, date: '' });
    };

    const savePost = () => {
        if (popup.post) {
            const newDate = (document.getElementById('editDate') as HTMLInputElement).value;
            const newTitle = (document.getElementById('editTitle') as HTMLInputElement).value;

            posts.forEach(p => {
                if (p.date === popup.date && p.title === popup.post!.title && p.platform === popup.post!.platform) {
                    p.title = newTitle;
                    p.date = newDate;
                }
            });

            closePopup();
            renderCalendar();
        }
    };

    const deletePost = () => {
        if (popup.post) {
            const index = posts.indexOf(popup.post);
            if (index > -1) {
                posts.splice(index, 1);
            }

            closePopup();
            renderCalendar();
        }
    };

    return (
        <div className="calendar">
            <div className="calendar-header">
                <div>
                    <button 
                        className={isWeekView ? 'active' : ''} 
                        onClick={() => setIsWeekView(true)}
                    >
                        Week
                    </button>
                    <button 
                        className={!isWeekView ? 'active' : ''} 
                        onClick={() => setIsWeekView(false)}
                    >
                        Month
                    </button>
                </div>
                <div>
                    <span id="monthYearDisplay">{`${selectedDate.toLocaleString('default', { month: 'long' })} ${selectedDate.getFullYear()}`}</span>
                </div>
                <div>
                    <button onClick={() => {
                        if (isWeekView) {
                            setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)));
                        } else {
                            setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)));
                        }
                    }}>
                        Back
                    </button>
                    <button onClick={() => setSelectedDate(new Date())}>Today</button>
                    <button onClick={() => {
                        if (isWeekView) {
                            setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)));
                        } else {
                            setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)));
                        }
                    }}>
                        Next
                    </button>
                </div>
            </div>
            <div className="days-header">
                <div>Sunday</div>
                <div>Monday</div>
                <div>Tuesday</div>
                <div>Wednesday</div>
                <div>Thursday</div>
                <div>Friday</div>
                <div>Saturday</div>
            </div>
            <div className="calendar-grid">
                {renderCalendar()}
            </div>

            {popup.show && popup.post && (
                <div className="popup">
                    <h3>Edit Post</h3>
                    <label htmlFor="editTitle">Title:</label>
                    <input type="text" id="editTitle" defaultValue={popup.post.title} />
                    <label htmlFor="editDate">Date:</label>
                    <input type="date" id="editDate" defaultValue={popup.date} />
                    <button onClick={savePost}>Save</button>
                    <button onClick={deletePost}>Delete</button>
                    <button onClick={closePopup}>Close</button>
                </div>
            )}
        </div>
    );
};

export default Calendar;
