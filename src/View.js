import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const View = ()=>{
  //초기값 설정, 변수에 담기
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();
  let { id } = useParams();
  //console.log(id); 에러찾기

  
    useEffect(()=>{
      console.log('useEffect 실행');
      Axios.get(`http://localhost:8000/detail?id=${id}`)
      .then((res) => {
        const {data} = res;  //destructuring 비구조할당으로 변경
        
        setBoard({
          title: data[0].BOARD_TITLE,
          content: data[0].BOARD_CONTENT,
          image : data[0].IMAGE_PATH
        });

      })
      .catch((e)=> {
        // 에러 핸들링
        console.log(e);
      });     
    },[id]); //id값이 바뀌면
    
    console.log(board);

    //로딩되는 시간 벌어줌
    if(!board) return <div>Loading...</div>; 


  return(
    <div>
      <h2>{board.title}</h2>
      <h3>본문: {board.content}</h3>
      <img src={`http://localhost:8000/${board.image}`} style={{maxWidth:'300px'}}></img>
      <hr/>
      <Button variant="btn btn-secondary" onClick={()=>{navigate(-1)}}>
        목록
      </Button>
    </div>
  )
}
export default View;
