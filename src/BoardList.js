import React, { Component } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import Form from 'react-bootstrap/Form';
import { Link } from "react-router-dom";

/*
const submitTest = ()=>{
  //react->서버로 요청을 보내고, 그 결과를 출력

  // 지정된 ID를 가진 유저에 대한 요청
  Axios.get('http://localhost:8000/')
  .then(function (response) {
    // 성공 핸들링
    alert('등록 완료!');
    console.log(response);
  })
  .catch(function (error) {
    // 에러 핸들링
    console.log(error);
  })
}
*/


class Board extends Component {
  render() {
    return (
      <tr>
        <td>
          <Form.Check // prettier-ignore
            type="checkbox"
            id={`default-checkbox`}
            value={this.props.id}
            onChange={(e)=>{
              this.props.onCheckboxChange(e.target.checked, e.target.value) //인수두개 추가
            }}
          />
        </td>
        <td>{this.props.id}</td>
        <td> <Link to={`/view?id=${this.props.id}`}>{this.props.title}</Link></td>
        <td>{this.props.registerId}</td>
        <td>{this.props.date}</td>
      </tr>
    )
  }
  }


export default class BoardList extends Component {
  state = {
    BoardList : [],
    checkList : []
  }
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

  handleDelete = ()=>{
    if(this.state.checkList.length === 0){
      alert('먼저 삭제할 게시글을 선택하세요');
      return;
    }

    /*
    let boardIdList = '';
    this.state.checkList.at.forEach(num=>{
      boardIdList = boardIdList + `${num},`;
      console.log(boardIdList); //1,2,3
      })
      */
     let boardIdList = this.state.checkList.join(); //삭제하려고 체크한 번호 1,2,3

      Axios.post('http://localhost:8000/delete',{
        boardIdList
      })
      .then((res) => {
        //목록 다시 조회
        this.getList();
      })
      .catch((e)=> {
        // 에러 핸들링
        console.log(e);
      });
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

