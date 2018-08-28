<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Comment extends Model
{
    use SoftDeletes;

    protected $dates = ['deleted_at'];

    protected $fillable = ['comment'];

    public function post()
    {
        return $this->belongsTo('App\Post');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function comment_son()
    {
        return $this->hasMany('App\Comment', 'padre_id');
    }

    public function wasCreatedBy($user)
    {
        if(is_null($user))
            return false;

        return ($this->user_id === $user->id);
    }
}
