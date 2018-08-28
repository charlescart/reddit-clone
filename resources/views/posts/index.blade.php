@extends('layouts.app')

@section('content')
    <div class='container'>
        <div class="row">
            <div class="col-12">
                <a href="{{route('create_post_path')}}" class="float-right"> {{ trans('btn.create_post') }}</a>
            </div>
            @foreach($posts as $key => $row)
                <div class="col-12 col-md-6 col-lg-4" style="margin-bottom: 15px;">
                    <div class="card">
                        {{--<img class="card-img-top" src=".../100px180/" alt="Card image cap">--}}
                        <div class="card-body">
                            <h5 class="card-title text-truncate">{{ $row->title }}</h5>
                            <div class="card-text text-justify" style="min-height: 115px;">
                                @if(strlen(trim($row->description)) > 150)
                                    {{ substr(trim($row->description), 0, 150) }}...
                                @else
                                    {{ $row->description }}
                                @endif
                            </div>
                            <a href="{{ route('post_path', ['slug' => $row->slug]) }}"
                               class="btn btn-info btn-sm float-right">{{ trans('btn.details') }}</a>
                            @if($row->wasCreatedBy(Auth::user()))
                            <a href="{{ route('edit_post_path', ['post' => $row->id]) }}"
                               class="btn btn-info btn-sm float-right"
                               style="margin-right: 5px;">{{ trans('btn.edit') }}</a>
                            <button class="btn btn-info btn-sm float-right has-spinner btn-delete-post"
                                    data-load-text="{{ trans('btn.removing') }}" data-id="{{ $row->id }}"
                                    style="margin-right: 5px;">{{ trans('btn.delete') }}</button>
                                @endif
                        </div>
                        <div class="card-footer text-muted font-italic text-truncate"> {{ trans('info.posted') }} {{ $row->created_at->diffForHumans() }}, {{ __('By: :name', ['name' => $row->user->name ?? 'Anonimo']) }}</div>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="row">
            <div class="col" style="margin-top: 15px;">
                {{ $posts->links() }}
            </div>
        </div>
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('js/plugins/button-loader/button-loader.min.js') }}"></script>
    <script src="{{ asset('js/plugins/izi-toast/izi-toast.min.js') }}"></script>
    <script src="{{ asset('js/plugins/blockui/blockui.js') }}"></script>
    <script src="{{ asset('js/common/common-functions.js') }}"></script>
    <script src="{{ asset('js/posts/post-index.js') }}"></script>
@endpush

@push('styles')
    <link href="{{ asset('css/plugins/button-loader/button-loader.css') }}" rel="stylesheet">
    <link href="{{ asset('css/plugins/font-awesome/font-awesome.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/plugins/izi-toast/izi-toast.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/plugins/blockui/blockui.css') }}" rel="stylesheet">
@endpush