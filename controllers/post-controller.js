const Post = require('../models/post');
const validationSession = require('../utils/validation-session');
const validationInput = require('../utils/validation');

function index(req, res) {
    res.render('welcome', { csrfToken: req.csrfToken() });
}

async function getAdmin(req, res) {
    if (!res.locals.isAuth) {
        return res.status(401).render('401');
    }

    const posts = await Post.fetchAll();

    const sessionInputData = validationSession.getSessionErrorData(req, {
        title: '',
        content: ''
    });

    res.render('admin', {
        posts: posts,
        inputData: sessionInputData,
        csrfToken: req.csrfToken(),
    });
}

async function createPost(req, res) {
    const enteredTitle = req.body.title;
    const enteredContent = req.body.content;

    if (
        !validationInput.postIsValid(enteredTitle, enteredContent)
    ) {

        validationSession.getFlashErrorMessage(
            req,
            {
                message: 'Invalid input - please check your data.',
                title: enteredTitle,
                content: enteredContent,
            },
            function () {
                res.redirect('/admin');
            })
        return; // or return res.redirect('/admin'); => Has the same effect
    }

    const post = new Post(enteredTitle, enteredContent);
    const result = await post.save();

    console.log(result);

    res.redirect('/admin');
}

async function getSinglePost(req, res) {
    const post = new Post(null, null, req.params.id);
    await post.fetch();
    if (!post.title || !post.content) {
        return res.send('404'); // 404.ejs is missing at this point - it will be added later!
    }

    const sessionInputData = validationSession.getSessionErrorData(req, {
        title: post.title,
        content: post.content
    });

    res.render('single-post', {
        post: post,
        inputData: sessionInputData,
        csrfToken: req.csrfToken(),
    });
}

async function updatePost(req, res) {
    const enteredTitle = req.body.title;
    const enteredContent = req.body.content;
    const postId = req.params.id;

    if (
        !validationInput.postIsValid(enteredTitle, enteredContent)
    ) {
        validationSession.getFlashErrorMessage(
            req,
            {
                message: 'Invalid input - please check your data.',
                title: enteredTitle,
                content: enteredContent,
            },
            function () {
                res.redirect(`/posts/${req.params.id}/edit`);
            });

        return;
    }

    const post = new Post(enteredTitle, enteredContent, postId);
    const result = await post.save();

    console.log(result);

    res.redirect('/admin');
}

async function deletePost(req, res) {
    const postId = req.params.id;
    const post = new Post(null, null, postId);
    const result = await post.delete();

    console.log(result);

    res.redirect('/admin');
}

module.exports = {
    index, getAdmin, createPost, getSinglePost, updatePost, deletePost
}