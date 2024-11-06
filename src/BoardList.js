import React, { useCallback, useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";


function Board({id, title, registerId, date, onCheckboxChange}){
  return(
    <tr>
      <td>
        <Form.Check // prettier-ignore
          type="checkbox"
          id={`default-checkbox`}
          value={id}
          onChange={(e)=>{
            onCheckboxChange(e.target.checked, e.target.value) //인수두개 추가
          }}
        />
      </td>
      <td>{id}</td>
      <td> <Link to={`/view/${id}`}>{title}</Link></td>
      <td>{registerId}</td>
      <td>{date}</td>
    </tr>
  )
}

const BoardList = ({isComplete, handleModify})=>{
  const [boardList,setBoardList] = useState([]);
  const [checkList,setCheckList] = useState([]);

  const onCheckboxChange = (checked, id)=>{
    //기존의 checkList을(기존값) prevList로 받는거 
    setCheckList((prevList)=>{
      if(checked){
        return [...prevList,id]
      }else{
        return prevList.filter(item=> item !== id);
      }
    })
  }

  //페이지 열리자마자 한번 작동, list에 변경 생기면 다시 작동
  const getList = useCallback( ()=>{
    Axios.get('http://localhost:8000/list')
    .then((res)=>{
      // 성공 핸들링
      const {data} = res;
      setBoardList(data);
    })
    .catch((e)=>{
      // 에러 핸들링
      console.log(e);
    });
  },[]);//최초 한번 실행
  
  useEffect(()=>{
    getList();
  },[getList]) //최초 한번 getList실행, getList객체가 변경되면(useCallback이 알려줌) getList실행

  useEffect(()=>{
    if(isComplete){
      getList();
    }
  },[isComplete])

  /*위에구문으로
  componentDidUpdate(prevProps) {
    // 목록 다시 조회
    if (this.props.isComplete !== prevProps.isComplete) {
      this.getList();
    }
  }
  */

  const handleDelete = ()=>{
    if(checkList.length === 0){
      alert('먼저 삭제할 게시글을 선택하세요');
      return;
    }

     let boardIdList = checkList.join(); //삭제하려고 체크한 번호 1,2,3

      Axios.post('http://localhost:8000/delete',{
        boardIdList
      })
      .then((res) => {
        //목록 다시 조회
        getList();
      })
      .catch((e)=> {
        // 에러 핸들링
        console.log(e);
      });
  }


  return(
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>선택</th>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
          </tr>
        </thead>
        <tbody>
          {
            boardList.map(
              item=><Board 
                key={item.BOARD_ID} 
                id={item.BOARD_ID} 
                title={item.BOARD_TITLE} 
                registerId={item.REGISTER_ID} 
                date={item.REGISTER_DATE}
                onCheckboxChange={onCheckboxChange}
              />
            )
          }
        </tbody>
      </Table>
      <div className="d-flex gap-1">
        <Link to="/write" className="btn btn-primary">
          글쓰기
        </Link>
        <Button variant="secondary" onClick={()=>{
          handleModify(checkList);
        }}>수정하기</Button>
        <Button variant="danger" onClick={()=>{handleDelete();}}>삭제하기</Button>
      </div>
    </>
  )
}

export default BoardList;
