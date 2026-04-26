
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect} from 'react';
import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { startBattle } from '../battleSlice';
import { fetchPokemon } from '../pokemonSlice';
import '../assets/BattleArena.css'


export default function BattleArena() {

  const dispatch = useDispatch();
  const { list, status } = useSelector(state => state.pokemon);
  const [selected_cont1, setSelected_cont1] = useState('');
  const [selected_cont2, setSelected_cont2] = useState('')
  const { log, winner, status_battle } = useSelector(state => state.battle);
  const [same_cont, setSame_cont] = useState(false)
  const [no_cont1, setNo_cont1] = useState(false)
  const [no_cont2, setNo_cont2] = useState(false)
  const [no_select_cont, setNo_select_cont] = useState(false)
  const [isCont1Vis, setIsCont1Vis] = useState(false)
  const [isCont2Vis, setIsCont2Vis] = useState(false)
  const [resetbuttoninvisible, setResetbuttoninvisible] = useState(false)
  const [startbuttoninVisible, setStartbuttoninvisible] = useState(true)
  const jsConfetti = new JSConfetti()



  useEffect(() => {
    if (status === 'idle' && (!list || list.length === 0)) {
      dispatch(fetchPokemon());
    }
  }, [status, list, dispatch]);

 

  const chosen_cont1= list.find(p => p.name === selected_cont1);
  const chosen_cont2 = list.find(p=>p.name === selected_cont2);


  const handleBattle = () => {
   
      if((chosen_cont1 !== undefined && chosen_cont2!== undefined)
        &&(chosen_cont1!== 'Select a Pokémon' && chosen_cont2 !== 'Select a Pokémon') 
        && (chosen_cont1 !== chosen_cont2) 
        && same_cont === false){
        
      
        dispatch(startBattle({ pokemon1: chosen_cont1.name, pokemon2: chosen_cont2.name }));
        setNo_cont1(false)
        setNo_cont2(false)
        setNo_select_cont(false)
        setStartbuttoninvisible(false)
        setResetbuttoninvisible(true)
        jsConfetti.addConfetti()
    }

     else if(chosen_cont2 === chosen_cont1){
        setSame_cont(true)
        setNo_cont1(false)
        setNo_cont2(false)
        setNo_select_cont(false)
        setIsCont1Vis(false)
        setIsCont2Vis(false)
        setResetbuttoninvisible(false)
        
     }

     else if(chosen_cont1 === undefined || chosen_cont1 === null || chosen_cont1 === 'Select a Pokémon'){
        setNo_cont1(true)
        setNo_cont2(false)
        setNo_select_cont(false)
        setSame_cont(false)
        setResetbuttoninvisible(false)

     }

     else if(chosen_cont2 === undefined || chosen_cont2 === null || chosen_cont2 === 'Select a Pokémon'){
        setNo_cont2(true)
        setNo_cont1(false)
        setSame_cont(false)
        setNo_select_cont(false)
        setResetbuttoninvisible(false)

     }
     else{
        setNo_select_cont(true)
        setNo_cont1(false)
        setNo_cont2(false)
        setSame_cont(false)
        setResetbuttoninvisible(false)

     }

  }
  return (

    <Container fluid className='d-flex justify-content-center align-items-start full-height bg-dark text-white mt-5 pt-5'>
        <Row>
            <h1 className='d-flex justify-content-center align-items-center pb-5'> The Ultimate Pokemon Battle! 🥊</h1>
            <Col>
                
                {
                    isCont1Vis === false && resetbuttoninvisible === false && (
                        <>
                            <label htmlFor="contestant_1" className='px-3 m-3 p-3'>Choose Contestant1:</label>
                            <select id="contestant_1"  onChange={(e) =>{
                                setSelected_cont1(e.target.value)
                                setNo_cont1(false)
                                setNo_cont2(false)
                                setNo_select_cont(false)
                                setSame_cont(false)
                                setIsCont1Vis(true)
                                }
                            } 
                            >
                                <option value="">Select a Pokémon</option>
                                {list.map(p => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </>
                     )
                }
               
                {
                    isCont1Vis === true &&(
                        <>
                            {chosen_cont1 && (
                                <div style={{ marginTop: '1rem' }} className='walking'>
                                    <Image src={chosen_cont1.image} alt={chosen_cont1.name} fluid className='w-75'/>
                                    <p className='w-50'>{chosen_cont1.name}</p>
                                </div>
                            )}
                        </>
                    )
                }

                
            </Col>
            <Col xs={6}>'
                {
                    isCont2Vis === false && resetbuttoninvisible === false && (
                        <>
                            <label htmlFor="contestant_2" className='px-3 m-3 p-3'>Choose Contestant2:</label>
                            <select id="contestant_2" onChange={(e) => {
                                setSelected_cont2(e.target.value)
                                setNo_cont1(false)
                                setNo_cont2(false)
                                setNo_select_cont(false)
                                setSame_cont(false)
                                setIsCont2Vis(true)
                            }}>
                                Contestant 2: <option value="">Select a Pokémon</option>
                                {list.map(p => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                                ))}
                            </select>
                        </>
                    )
                }
                
                {
                    isCont2Vis === true  && (
                        <>
                            {chosen_cont2 && (
                            <div style={{ marginTop: '1rem' }} className='walking-element'>
                                <Image src={chosen_cont2.image} alt={chosen_cont2.name} fluid className='w-75'/>
                                <p className='w-50'>{chosen_cont2.name}</p>
                            </div>
                            )}
                        </>
                        
                    )
                }
                
            </Col>
            
            

            <Col xs={6} className='pt-5 d-flex justify-content-center align-items-center'>


            {startbuttoninVisible && (
                <Button variant="warning" onClick={handleBattle}>Start Battle</Button>

            )}
            
            {
                resetbuttoninvisible && (
                    <Button variant="primary" onClick={()=>{
                    setIsCont1Vis(false)
                    setIsCont2Vis(false)
                    setResetbuttoninvisible(false)
                    setStartbuttoninvisible(true)

                    
                }}>Battle Re-start</Button>
                
                )
            }
                    {console.log('After selecting both', same_cont, resetbuttoninvisible, startbuttoninVisible)}
                    {same_cont === false && startbuttoninVisible === false && (
                    < div className='mt-5 mx-4 p-4  mb-5 border border-5 border-warning'>
                        {status_battle === 'loading' && <p>Battle in progress...</p>}
                        {log.map((line, i) => <p key={i}>{line}</p>)}
                        {winner && <h2>Winner: {winner}</h2>}
                    </div>
                    )
                }
                
                {no_cont1 && <h2 className='text-warning pt-mt-5 px-5'>Choose contestant 1!</h2>}
                {no_cont2 && <h2 className='text-warning pt-mt-5 px-5'>Choose contestant 2</h2>}
                {no_select_cont && <h2 className='text-warning pt-mt-5 px-5'>Select the contestants</h2>}
                {same_cont && <h2 className='text-warning pt-mt-5 px-5'>Select different contestants</h2>}

                
                
            </Col>
        </Row>
    </Container>
  );
}
