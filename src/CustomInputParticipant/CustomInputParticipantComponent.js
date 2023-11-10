import './CustomInputParticipantComponent.css'
import {useEffect, useState} from "react";
import {findDOMNode} from "react-dom";
import { ReactComponent as CloseSvg } from '../icons/close.svg'
import {click} from "@testing-library/user-event/dist/click";


const CustomInputParticipantComponent = () =>{

    const lis_participant = ['jhon', 'pete', 'bob', 'daphna', 'juli'];
    const [new_part, setNewPart] = useState([]);
    const changeInputBlock = (e)=>{
        const sub = e.target.value;
        if (lis_participant.indexOf(sub) === -1){
            return;
        }

        if (new_part.indexOf(sub) === -1) {
            setNewPart(prevState => ([...prevState, sub]))
            e.target.value = '';
        }

    }

    useEffect(() => {
        console.log(new_part);
    }, [new_part]);


    const clickDel = (e) =>{
        // const click_name = findDOMNode(e.target).parentNode.textContent;
        console.log(findDOMNode(e.target).parentNode);
        const click_name =findDOMNode(e.target).parentNode.firstElementChild.textContent

        let array = [...new_part]; // make a separate copy of the array
        var index = array.indexOf(click_name)
        console.log(click_name);
        if (index !== -1) {
            array.splice(index, 1);
            setNewPart(array);
            console.log('deleted');
        }

    }
    return(
        <div className='input-paricipant-container'>
            {/*<div>{new_part}</div>*/}

            <input type='text' list="character" onChange={changeInputBlock} placeholder="Участники"/>
            <datalist id="character">
                {lis_participant.map((value)=>{
                    return (<option value={value}/>);
                })}
            </datalist>
            <div className='paricipant-tag-cont'>
            {new_part.map((value)=>{
                return (<div className='paricipant-tag' >

                    <span className='paricipant-span'>{value}</span>
                    <CloseSvg className='closeSvg' onClick={clickDel}/>
                    {/*<button onClick={clickDel}>del</button>*/}
                </div>);
            })}
            </div>
        </div>
    );
}

export default CustomInputParticipantComponent;