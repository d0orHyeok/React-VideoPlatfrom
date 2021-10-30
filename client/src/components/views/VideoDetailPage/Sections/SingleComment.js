import React, { useState } from "react";
import { Comment, Avatar, Button, Input } from "antd";
import Axios from "axios";
import { useSelector } from "react-redux";

const { TextArea } = Input;

function SingleComment(props) {
    const user = useSelector((state) => state.user);

    const [OpenReply, setOpenReply] = useState(false);
    const [CommentValue, setCommentValue] = useState("");

    const onClickReplyOpen = () => {
        setOpenReply(!OpenReply);
    };

    const onChangeHandler = (e) => {
        setCommentValue(e.currentTarget.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const variable = {
            content: CommentValue,
            writer: user.userData._id,
            postId: props.postId,
            responseTo: props.comment._id,
        };

        Axios.post("/api/comment/saveComment", variable).then((response) => {
            if (response.data.success) {
                props.refreshFunction(response.data.result);
                setCommentValue("");
                setOpenReply(false);
            } else {
                alert("코멘트를 저장하지 못했습니다.");
            }
        });
    };

    const actions = [
        <span key="comment-basic-reply-to" onClick={onClickReplyOpen}>
            Reply to
        </span>,
    ];

    return (
        <div>
            <Comment
                actions={actions}
                author={props.comment.writer.name}
                avatar={<Avatar src={props.comment.writer.image} alt="image" />}
                content={<p>{props.comment.content}</p>}
            ></Comment>

            {OpenReply && (
                <form style={{ display: "flex" }} onSubmit={onSubmit}>
                    <textarea
                        style={{ width: "100%", borderRadius: "5px" }}
                        placeholder={"코멘트를 작성해 주세요"}
                        value={CommentValue}
                        onChange={onChangeHandler}
                    ></textarea>
                    <br />
                    <button onClick={onSubmit} style={{ width: "20%", height: "52px" }}>
                        Submit
                    </button>
                </form>
            )}
        </div>
    );
}

export default SingleComment;
