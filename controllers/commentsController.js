const Comment = require('../schemas/comment');

const getAllComments = async (req, res) => {
    const comments = await Comment.find()
        .sort({ createdAt: -1 });
    if (!comments) return res.status(204).json({ 'message': '댓글이 없습니다.' });
    res.json(comments);
}

const createNewComment = async (req, res) => {
    if (!req?.body?.post_id) { return res.status(400).json({ 'message': 'ID parameter is required.' }); }
    if (!req?.body?.content) { return res.status(400).json({ 'message': '댓글을 입력하세요' }); }
    try {
        const result = await Comment.create({
            username: req.user.username,
            content: req.body.content,
            post_id: req.body.post_id
        });
        res.status(201).json({message: "댓글 작성 성공", result});
    } catch (err) {
        console.error(err);
    }
}

const updateComment = async (req, res) => {
    const { id, content } = req.body;
    if (!id) {
        return res.status(400).json({ 'message': 'Comment ID required.' });
    }
    try {
        const comment = await Comment.findOne({ _id: id }).exec();
        if (!comment) {
            return res.status(404).json({ "message": `No comment matches ID ${id}.` });
        }
        if (comment.username !== req.user.username) {
            return res.status(403).json({ "message": "이 댓글을 업데이트할 권한이 없습니다." });
        }
        if (content) comment.content = content;
        const result = await comment.save();
        res.json({ message: "댓글 업데이트 성공", result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "message": "Error updating." });
    }
};

const deleteComment = async (req, res) => {
    if (!req?.body?.id) {return res.status(400).json({ 'message': 'Comment ID required.' });}
    try {
        const comment = await Comment.findOne({ _id: req.body.id }).exec();
        if (!comment) {
            return res.status(404).json({ "message": `No comment matches ID ${req.body.id}.` });
        }
        if (comment.username !== req.user.username) {
            return res.status(403).json({ "message": "이 게시물을 삭제할 권한이 없습니다." });
        }
        const result = await comment.deleteOne({ _id: req.body.id });
        res.json({ message: "게시물 삭제 완료.", result });
    } catch (err) {
        res.status(500).json({ "message": "Error deleting the comment." });
    }
};

module.exports = {
    getAllComments,
    createNewComment,
    updateComment,
    deleteComment
}