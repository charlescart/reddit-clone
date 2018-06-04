@extends('layouts.app')

@section('content')
    <div class='container'>
        <div class='row'>
            <div class='col-sm-12'>
                @if(isset($post))
                    <h2 class="text-justify">{{$post->title}}</h2>
                    <p class="text-justify">{{$post->description}}</p>
                    <p>Posted {{$post->created_at->diffForHumans()}}.</p>
                @else
                    <h2>Post no encontrado!</h2>
                @endif
            </div>
        </div>
        <hr>
    </div>
@endsection