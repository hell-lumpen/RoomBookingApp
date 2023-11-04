import './RoomInfoBlockComponent.css'
import './RoomInfoBlockAnimation.css'
import React from "react";


const RoomInfoBlockComponent = ({ data }) => {
    if (data === {}){
        return <div className='room-info-block'>Ничего нет</div>
    }else {
        let date = new Date(data.startTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        let dateStr = `${day}-${month}-${year}`;

        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const timeStrStart = `${hours}:${minutes}`;

        let dateEnd = new Date(data.endTime);
        const hoursEnd = String(dateEnd.getHours()).padStart(2, '0');
        const minutesEnd = String(dateEnd.getMinutes()).padStart(2, '0');
        const timeStrEnd = `${hoursEnd}:${minutesEnd}`;

        return (
            <div className='room-info-block' id='room-info-block'>
                <div className='room-info-block-tag'>
                    Лекция
                </div>

                <div className="room-info-block-time-container" id='room-info-block-time-container'/>

                <div className='room-info-block-title'>
                    {document.documentElement.style.getPropertyValue('--new_title')}
                </div>
                <div className='room-info-block-prepod' id='room-info-block-prepod'/>

                {/*<div id='title-block' className='title-block'>{data.description}</div>*/}
                {/*<div className='container1'>*/}

                {/*    <div id='time-block' className='info-block'>*/}
                {/*        <strong className='title'>Время:</strong>*/}
                {/*        <div className='input-block'>{timeStrStart}</div>*/}
                {/*        <div className='title-time'>{'\u2013'}</div>*/}
                {/*        <div className='input-block'>{timeStrEnd}</div>*/}
                {/*    </div>*/}

                {/*    <div className='info-block'>*/}
                {/*        <strong className='title'>Преподаватель</strong>*/}
                {/*        <div id='prepod-block' className='input-block'>*/}
                {/*            {data.username}*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div id='room-block' className='info-block'>*/}
                {/*        <strong className='title'>Аудитория:</strong>*/}
                {/*        <div className='input-block'>{data.roomName}</div>*/}
                {/*    </div>*/}

                {/*    <div id='date-block' className='info-block'>*/}
                {/*        <strong className='title'>Дата:</strong>*/}
                {/*        <div className='input-block'>{dateStr}</div>*/}
                {/*    </div>*/}

                {/*    <div id='purpose' className='info-block'>*/}
                {/*        <strong className='title'>Описание:</strong>*/}
                {/*        <div className='input-block'>{data.description}</div>*/}
                {/*    </div>*/}

                {/*</div>*/}
            </div>

        );
    }
}

export default RoomInfoBlockComponent;