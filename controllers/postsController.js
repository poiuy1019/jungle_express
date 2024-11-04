const Post = require('../schemas/post');
const Comment = require('../schemas/comment');

const getAllPosts = async (req, res) => {
    const posts = await Post.find()
        .sort({ createdAt: -1 });
    if (!posts) return res.status(204).json({ 'message': '게시물이 없습니다.' });
    res.json(posts);
}

const createNewPost = async (req, res) => {
    if (!req?.body?.title) { return res.status(400).json({ 'message': '게시물 제목을 입력하세요.' }); }
    if (!req?.body?.content) { return res.status(400).json({ 'message': '게시물 내용을 입력하세요' }); }
    try {
        const result = await Post.create({
            title: req.body.title,
            username: req.user.username,
            content: req.body.content
        });
        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updatePost = async (req, res) => {
    const { id, title, content } = req.body;
    if (!id) {
        return res.status(400).json({ 'message': 'ID parameter is required.' });
    }
    try {
        const post = await Post.findOne({ _id: id }).exec();
        if (!post) {
            return res.status(404).json({ "message": `No post matches ID ${id}.` });
        }
        if (post.username !== req.user.username) {
            return res.status(403).json({ "message": "이 게시물을 업데이트할 권한이 없습니다." });
        }
        if (title) post.title = title;
        if (content) post.content = content;
        const result = await post.save();
        res.json({ message: "게시물 업데이트 성공", result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "message": "Error updating the post." });
    }
};


const deletePost = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({ 'message': 'Post ID required.' });
    }

    try {
        const post = await Post.findOne({ _id: req.body.id }).exec();
        if (!post) {
            return res.status(404).json({ "message": `No post matches ID ${req.body.id}.` });
        }
        if (post.username !== req.user.username) {
            return res.status(403).json({ "message": "이 게시물을 삭제할 권한이 없습니다." });
        }
        const result = await post.deleteOne({ _id: req.body.id });
        const commentsResult = await Comment.deleteMany({ post_id: req.body.id });
        res.json({ 
            message: "게시물 및 관련 댓글 삭제 완료.", 
            Post: result, 
            comments: commentsResult 
        });
    } catch (err) {
        res.status(500).json({ "message": "Error deleting the post." });
    }
};

const getPost = async (req, res) => {
    if (!req?.params?.username) return res.status(400).json({ 'message': '사용자 이름을 입력해주세요.' });
    const posts = await Post.find({ username: req.params.username }).exec();
    if (!posts || posts.length === 0) {
        return res.status(404).json({ "message": `No posts found for username ${req.params.username}.` });
    }
    res.json(posts);
}

module.exports = {
    getAllPosts,
    createNewPost,
    updatePost,
    deletePost,
    getPost
}