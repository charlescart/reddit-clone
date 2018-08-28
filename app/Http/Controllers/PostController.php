<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Http\Requests\CreatePostRequest;
use App\Http\Requests\DeletePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PostController extends Controller
{

    public function __construct()
    {
        $this->middleware('auth')->except(['index', 'show']);
    }

    public function index()
    {
        $posts = Post::with('user')->orderBy('id', 'desc')->paginate(15);
        Log::info('Testing...', ['people' => 'Charles']);
        return view('posts.index', compact('posts'));
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)->first();
        if ($post) {
            $comments = Comment::with(['user', 'comment_son' => function ($query) {
                $query->whereColumn('comments.id', '<>', 'comments.padre_id');
            }])->where('comments.post_id', $post->id)->whereColumn('comments.id', 'comments.padre_id')
                ->orderBy('created_at', 'desc')->get();
            return view('posts.show', compact('post', 'comments'));
        } else
            abort(404, 'Not Found!');
    }

    public function create()
    {
        $post = New Post();
        return view('posts.create', compact('post'));
    }

    public function store(CreatePostRequest $request)
    {
        $post = New Post;
        $post->fill($request->only('title', 'description', 'slug'));
        $post->user_id = Auth()->user()->id;
        if ($post->save())
            return response()->json(['success' => true, 'msg' => 1, 'btn' => 2], 201);
        else
            return response()->json(['success' => false, 'msg' => -1], 200);
    }

    public function edit(Post $post)
    {
        if ($post->user_id != Auth()->user()->id) {
            session()->flash('msg', -3);
            return redirect()->route('posts_path');
        }

        return view('posts.edit', compact('post'));
    }

    public function update(Post $post, UpdatePostRequest $request)
    {
        $result = $post->update($request->only('title', 'description', 'slug', 'id'));
        return response()->json(($result) ? ['success' => true, 'msg' => 1, 'btn' => 2] : ['success' => false, 'msg' => -1]);
    }

    public function delete(Post $post, DeletePostRequest $request)
    {
        try {
            $result = Post::where($request->only('id'));
            $result = $result->delete();
            if ($result) {
                session()->flash('msg', 1);
                return response()->json(['success' => true, 'msg' => 1]);
            } else
                return response()->json(['success' => false, 'msg' => -1]);
//            return response()->json(($result) ? ['success' => true, 'msg' => 1] : ['success' => false, 'msg' => -1]);
        } catch (Exception $e) {
            report($e);
            return false;
        }
    }
}
