import React, { Component, useCallback, useEffect, useState } from 'react';
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


/*

export default class BoardList extends Component {

  onCheckboxChange = (checked, id)=>{
    const list = [...this.state.checkList]; //복사본을 만들어서 값 넣고, 그걸 교체하는게 바람직함
    if(checked){
      if(!list.includes(id)){
        list.push(id);
      }
    }else{
      let idx = list.indexOf(id);
      list.splice(idx, 1)
    }

    this.setState({
      checkList:list
    });
    console.log(this.state.checkList);
  }


  getList = ()=>{
    Axios.get('http://localhost:8000/list')
    .then((res)=>{
      // 성공 핸들링
      //const data = res.data; 요청해서 받아온값
      const {data} = res; //destructuring 비구조 할당으로 변경
      //console.log(data);
      this.setState({
        BoardList:data
      });
      this.props.renderComplete(); //App.js에 목록 출력이 완료되었다고 전달
    
    })
    .catch((e)=>{
      // 에러 핸들링
      console.log(e);
    });
  }
  componentDidMount(){
    this.getList();
  }


  componentDidUpdate(prevProps) {
    // 목록 다시 조회
    if (this.props.isComplete !== prevProps.isComplete) {
      this.getList();
    }
  }

  



  render() {
    //console.log(this.props)
    //console.log(this.state.BoardList[0].BOARD_TITLE);
    return (
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
              this.state.BoardList.map(
                item=><Board 
                  key={item.BOARD_ID} 
                  id={item.BOARD_ID} 
                  title={item.BOARD_TITLE} 
                  registerId={item.REGISTER_ID} 
                  date={item.REGISTER_DATE}
                  onCheckboxChange={this.onCheckboxChange}
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
            this.props.handleModify(this.state.checkList);
          }}>수정하기</Button>
          <Button variant="danger" onClick={()=>{this.handleDelete();}}>삭제하기</Button>
        </div>
      </>
    
    )
  }
}

/* */