@extends('layouts.app')

@section('content')
    <div class='container'>

        @foreach($posts as $key => $row)
            <div class='row'>
                <div class='col-sm-12'>
                    <a href="{{route('post_path', ['title' => $row->url])}}">
                        <h4>{{$loop->iteration}}. {{$row->title}}</h4>
                    </a>
                    <p>Posted {{$row->created_at->diffForHumans()}}.</p>
                </div>
            </div>
            <hr>
        @endforeach

    </div>
@endsection