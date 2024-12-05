import React from 'react';
import { GoDotFill } from 'react-icons/go';
import '.././News.scss';

const New = ({
    post,
    formatTimeDifference,
    userOnlineStatus,
    iconAvatar,
    timeDifference,
    hasImages,
    isNumberInfor,
    handleRedirectPost,
    user,
}) => {
    return (
        <div className="post-item" style={{ cursor: 'pointer' }} onClick={() => handleRedirectPost(post)}>
            <div className="content-post">
                <div className="user-post">
                    <div className="info-user-post">
                        <div className="avatar-user">
                            <img src={user?.avatarLink || iconAvatar} alt="null" />
                            {userOnlineStatus && userOnlineStatus.Status === 'Online' ? (
                                <span className="icon-online">
                                    <GoDotFill />
                                </span>
                            ) : null}
                        </div>
                        <div className="info-user">
                            <h4>{user.FullName}</h4>
                            <p>{formatTimeDifference(timeDifference)}</p>
                        </div>
                    </div>
                    <div className="like-post">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                className="icon"
                                fill-rule="evenodd"
                                clipRule="evenodd"
                                d="M4.28472 1.28635C0.582052 2.41945 -0.738149 6.24881 0.391497 9.59912C2.20862 14.9716 10.0014 19 10.0014 19C10.0014 19 17.8521 14.9096 19.6102 9.59912C20.7388 6.24881 19.4102 2.41945 15.7075 1.28635C13.762 0.693293 11.5332 1.07333 10.0014 2.19843C8.38219 1.04133 6.23239 0.689293 4.28472 1.28635ZM13.7574 4.27342C13.3561 4.17072 12.9476 4.41276 12.8448 4.81404C12.7421 5.21532 12.9842 5.62388 13.3855 5.72658C14.768 6.08042 15.5877 7.00903 15.6825 7.93366C15.7247 8.34572 16.093 8.64549 16.5051 8.60323C16.9171 8.56097 17.2169 8.19267 17.1747 7.78062C16.9982 6.06045 15.5644 4.73591 13.7574 4.27342Z"
                                fill="#C5D0E6"
                            />
                        </svg>
                    </div>
                </div>
                <div className="title-post">
                    <h2 className="post-title">{`[${post.Title}]`}</h2>
                    <p className="post-content">{post.Content}</p>
                </div>
                {hasImages ? (
                    <div className="avatar-post">
                        {post.Images.length > 0 &&
                            post.Images.map((e, index) => <img src={e} alt={`Images ${index}`} key={index} />)}
                    </div>
                ) : null}
                <div className="hagtags-post">
                    {post.Hastags.length > 0 &&
                        post.Hastags.map((hastag, index) => (
                            <div className="hagtags-pos-item" key={index}>
                                {hastag}
                            </div>
                        ))}
                </div>
                {isNumberInfor &&
                    isNumberInfor.map((e, index) => {
                        if (e.PostID === post.PostID) {
                            return (
                                <div className="react-post" key={index}>
                                    <p>{`${e.TotalLike} Likes`}</p>
                                    <p>{`${e.TotalComment} Comments`}</p>
                                    <p>{`${e.TotalShare} Shares`}</p>
                                </div>
                            );
                        }
                        return null;
                    })}
            </div>
        </div>
    );
};

export default New;
