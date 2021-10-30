import React, { useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import SingleComment from "./SingleComment";
import ReplyComment from "./ReplyComment";

function Comment(props) {
    const videoId = props.postId;
    const user = useSelector((state) => state.user);
    const [commentValue, setcommentValue] = useState("");

    const onChangeHandler = (e) => {
        setcommentValue(e.currentTarget.value);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        const variable = {
            content: commentValue,
            writer: user.userData._id,
            postId: videoId,
        };

        Axios.post("/api/comment/saveComment", variable).then((response) => {
            if (response.data.success) {
                props.refreshFunction(response.data.result);
                setcommentValue("");
            } else {
                alert("코멘트를 저장하지 못했습니다.");
            }
        });
    };

    return (
        <div>
            <br />
            <p>Replies</p>
            <hr />
            {/* Comment Lists */}
            {props.commentLists &&
                props.commentLists.map((comment, index) => {
                    return (
                        !comment.responseTo && (
                            <React.Fragment key={index}>
                                <SingleComment
                                    refreshFunction={props.refreshFunction}
                                    comment={comment}
                                    postId={videoId}
                                />
                                <ReplyComment
                                    refreshFunction={props.refreshFunction}
                                    parentCommentId={comment._id}
                                    commentLists={props.commentLists}
                                    postId={videoId}
                                />
                            </React.Fragment>
                        )
                    );
                })}
            {/* Root Comment Form */}
            <form style={{ display: "flex" }} onSubmit={onSubmit}>
                <textarea
                    style={{ width: "100%", borderRadius: "5px" }}
                    placeholder={"코멘트를 작성해 주세요"}
                    onChange={onChangeHandler}
                ></textarea>
                <br />
                <button onClick={onSubmit} style={{ width: "20%", height: "52px" }}>
                    Submit
                </button>
            </form>
        </div>
    );
}

export default Comment;
