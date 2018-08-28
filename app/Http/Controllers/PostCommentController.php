<?php

namespace App\Http\Controllers;

use App\Comment;
use App\Post;
use App\Http\Requests\CreatePostCommentRequest;
use Illuminate\Http\Request;
use View;

class PostCommentController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Post $post, CreatePostCommentRequest $request)
    {
        if (!$request->has('padre_id'))
            $request->padre_id = Comment::withTrashed()->count() + 1;

        $comment = New Comment;
        $comment->fill($request->only('comment'));
        $comment->padre_id = $request->padre_id;
        $comment->user_id = Auth()->user()->id;
        $comment->post_id = $post->id;
        if ($comment->save()) {
            $comments = Comment::with(['user', 'comment_son' => function($query){
                $query->whereColumn('comments.id','<>', 'comments.padre_id');
            }])->where('comments.post_id', $post->id)->whereColumn('comments.id', 'comments.padre_id')
                ->orderBy('created_at', 'desc')->get();
            $view = View::make('partials.post-comments', compact('comments'))->render();
            return response()->json(['success' => true, 'msg' => 2, 'comments' => $view], 201);
        } else
            return response()->json(['success' => false, 'msg' => -1], 200);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
    }
}
