@extends('layouts.app')

@section('content')
    <div class='container'>
        @if(isset($post))
            <div class='row'>
                <div class='col-sm-12'>
                    <h2 class="text-justify">{{ $post->title }}</h2>
                    <p class="text-justify">{{ $post->description }}</p>
                    <p>{{ __('Posted') }} {{ $post->created_at->diffForHumans() }}, {{ __('By: :name', ['name' => $post->user->name]) }}.</p>
                </div>
            </div>
            <hr>
            <div class="row justify-content-md-center">
                <div class="col">
                    <form action="{{ route('store.comment.path', ['post' => $post->id]) }}" id="form-comment">
                        @csrf
                        <div class="form-group">
                            @auth
                                <label for="comment">{{ __('Add your comment as :name', ['name' => strtolower(Auth::user()->name)]) }}</label>
                            @else
                                <label for="comment">{{ __('Add your comment') }}</label>
                            @endauth
                            <textarea id="comment" class="form-control" name="comment" cols="30" rows="4" placeholder="{{ __('Write comment') }}"></textarea>
                            <div class="invalid-feedback"></div>
                        </div>

                        <div class="form-group">
                            <div class="w-100"></div>
                            <button type="submit" class="btn btn-info btn-sm has-spinner" data-load-text="{{ trans('btn.publishing') }}">{{ trans('btn.to_post') }}</button>
                        </div>

                    </form>
                </div>
            </div>

            <div class="row justify-content-end content-comments" style="margin-top: 35px;">
                @include('partials.post-comments')
            </div>
        @else
            <h2>Post no encontrado!</h2>
        @endif
    </div>
@endsection

@push('scripts')
    <script src="{{ asset('js/plugins/button-loader/button-loader.min.js') }}"></script>
    <script src="{{ asset('js/plugins/izi-toast/izi-toast.min.js') }}"></script>
    <script src="{{ asset('js/plugins/blockui/blockui.js') }}"></script>
    <script src="{{ asset('js/common/common-functions.js') }}"></script>
    <script src="{{ asset('js/posts/post-show.js') }}"></script>
@endpush

@push('styles')
    <link href="{{ asset('css/plugins/button-loader/button-loader.css') }}" rel="stylesheet">
    <link href="{{ asset('css/plugins/font-awesome/font-awesome.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/plugins/izi-toast/izi-toast.min.css') }}" rel="stylesheet">
    <link href="{{ asset('css/plugins/blockui/blockui.css') }}" rel="stylesheet">
@endpush