import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Axios from "axios";
import { useNavigate, Link } from "react-router-dom";


const Write = ({boardId, isModifyMode, handleCancel}) => {
  const navigate = useNavigate();
  const [isEditMode,setIsEditMode] = useState(false);
  const [title,setTitle] = useState('');
  const [content,setContent] = useState('');
  const [image, setImage] = useState(null);
  
  const handleImageChange = (e)=>{
    console.log(e.target.files[0]);
    setImage(e.target.files[0]);
  }

  const write = (e)=>{
    e.preventDefault();

    //파일첨부하기
    const formData = new FormData(); 
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);


    Axios.post('http://localhost:8000/insert',formData,{
      //전송방식
      headers:{"Content-Type":"multipart/form-data"}
    })
    .then((res) => {
      navigate('/'); //등록 완료 후 홈으로 이동
    })
    .catch((e)=> {
      // 에러 핸들링
      console.log(e);
    });  


  }


  const update = (e)=>{
    e.preventDefault();
    Axios.post('http://localhost:8000/update',{
      title:title,
      content:content,
      id:boardId //수정할 글 번호
    })
    .then((res) => {
      setTitle('');
      setContent('');
      setIsEditMode(false);
      handleCancel();
      //글 수정 완료 후 수정모드 ->false 로 변경, 목록을 다시 조회, boardId 초기화
    })
    .catch((e)=> {
      // 에러 핸들링
      console.log(e);
    });  
  }


  const detail = () =>{
    //글번호에 맞는 데이터 조회, 글 결과를 title, content반영, 수정모드 true    
    Axios.get(`http://localhost:8000/detail?id=${boardId}`)
    .then((res) => {
      const {data} = res;  //destructuring 비구조할당으로 변경

      setTitle(data[0].BOARD_TITLE);
      setContent(data[0].BOARD_CONTENT);
      setIsEditMode(true);

    })
    .catch((e)=> {
      // 에러 핸들링
      console.log(e);
    });     
  }

  /* 아래 useEffect로 변경
    componentDidUpdate(prevProps) {
    // 수정모드이고 boardId가 변경되었다면, 그 글의 내용조회(detail 함수) 실행
    if (this.props.isModifyMode && this.props.boardId !== prevProps.boardId) {
      this.detail();
    }
  }
  */
  useEffect(()=>{
    if(isModifyMode && boardId){
      detail();
    }

  },[isModifyMode, boardId]);




  /*
    const handleChangeTitle = (e)=>{

      setTitle(e.target.name)

      //따로작성
      // this.setState({
      //   [e.target.name]:e.target.value //계산된 속성
      // });

    }
  */
  const handleChangeTitle = (e) => setTitle(e.target.value);
  const handleChangeContent = (e) => setContent(e.target.value);


  return (
    <Form>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>제목</Form.Label>
          <Form.Control type="text" name="title"  value={title} placeholder="제목을 입력하세요" onChange={handleChangeTitle}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="content">
          <Form.Label>내용</Form.Label>
          <Form.Control as="textarea" name="content" value={content} rows={3} onChange={handleChangeContent} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="image">
          <Form.Label>이미지</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
        </Form.Group>
        <div className="d-flex gap-1">
          <Button variant="primary" type="submit" onClick={isEditMode ? update : write}>{isEditMode ? '수정완료' : '입력완료'}</Button>
          <Link to="/" className="btn btn-secondary">
           취소
          </Link>
        </div>      
      </Form>
  )
}



export default Write;
/*
export default class Write extends Component {
  state= {
    isModifyMode:false,
    title:'',
    content:'',
    redirect: false //주소 변경 상태 추가
  }
  write = (e)=>{
    e.preventDefault();
    Axios.post('http://localhost:8000/insert',{
      title:this.state.title,
      content:this.state.content
    })
    .then((res) => {
      //console.log(res);
      this.setState({
        redirect: true
      })
    })
    .catch((e)=> {
      // 에러 핸들링
      console.log(e);
    });  
  }

  update = (e)=>{
    e.preventDefault();
    Axios.post('http://localhost:8000/update',{
      title:this.state.title,
      content:this.state.content,
      id:this.props.boardId //수정할 글 번호
    })
    .then((res) => {
      this.setState({
        title:'',
        content:'',
        isModifyMode: false
      });
      this.props.handleCancel();
      //글 수정 완료 후 수정모드 ->false 로 변경, 목록을 다시 조회, boardId 초기화
    })
    .catch((e)=> {
      // 에러 핸들링
      console.log(e);
    });  
  }

  






  


  render() {
    if(this.state.redirect){
      return <Navigate to="/" />;
    }
    return (      
      <Form>
        <Form.Group className="mb-3" controlId="title">
          <Form.Label>제목</Form.Label>
          <Form.Control type="text" name="title"  value={this.state.title} placeholder="제목을 입력하세요" onChange={this.handleChange}/>
        </Form.Group>
        <Form.Group className="mb-3" controlId="content">
          <Form.Label>내용</Form.Label>
          <Form.Control as="textarea" name="content" value={this.state.content} rows={3} onChange={this.handleChange} />
        </Form.Group>
        <div className="d-flex gap-1">
          <Button variant="primary" type="submit" onClick={this.state.isModifyMode ? this.update : this.write}>{this.state.isModifyMode ? '수정완료' : '입력완료'}</Button>
          <Link to="/" className="btn btn-secondary">
           취소
          </Link>
        </div>      
      </Form>
    )
  }
}

*/