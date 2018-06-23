<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreatePostRequest;
use App\Http\Requests\DeletePostRequest;
use App\Http\Requests\UpdatePostRequest;
use App\Post;
use Illuminate\Http\Request;

class PostController extends Controller
{

    public function __construct()
    {

    }

    public function index()
    {
        $posts = Post::orderBy('id', 'desc')->paginate(15);
        return view('posts.index', compact('posts'));
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)->first();
        return view('posts.show', compact('post'));
    }

    public function create()
    {
        $post = New Post();
        return view('posts.create', compact('post'));
    }

    public function store(CreatePostRequest $request)
    {
        $result = Post::firstOrCreate($request->only('title', 'description', 'slug'));
        return response()->json(($result->wasRecentlyCreated) ? ['success' => true, 'msg' => 1] : ['success' => false, 'msg' => -1]);
    }

    public function edit(Post $post)
    {
        return view('posts.edit', compact('post'));
    }

    public function update(Post $post, UpdatePostRequest $request)
    {
        $result = $post->update($request->only('title', 'description', 'slug', 'id'));
        return response()->json(($result) ? ['success' => true, 'msg' => 1] : ['success' => false, 'msg' => -1]);
    }

    public function delete(DeletePostRequest $request)
    {
        try {
            $result = Post::where($request->only('id'));
            $result = $result->delete();
            return response()->json(($result) ? ['success' => true, 'msg' => 1] : ['success' => false, 'msg' => -1]);
        } catch (Exception $e) {
            report($e);
            return false;
        }
    }
}
