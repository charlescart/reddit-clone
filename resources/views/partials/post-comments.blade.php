@if($comments->count() > 0)

    @foreach($comments as $comment)
        <div class="col-md-2 col-lg-1 d-none d-md-block">
            <img data-src="holder.js/75x75" class="rounded" alt="75x75"
                 src="{{ Avatar::create($comment->user->name)->toBase64() }}"
                 data-holder-rendered="true" style="width: 75px; height: 75px;">
        </div>
        <div class="col comment-box-{{ $comment->id }}" style="padding-left: 0;">
            <div class="jumbotron jumbotron-fluid rounded" style="padding: 8px; margin-bottom: 5px;">
                <div class="container">
                    <span class="lead font-weight-light">
                        {{ $comment->user->name }}
                        @if($comment->updated_at > $comment->created_at)
                            <smal><a href="#!" class="badge badge-pill badge-dark font-weight-light" style="font-size: .65em;">Mod</a></smal>
                        @endif
                    </span>
                    <span class="float-right d-none d-sm-block">{{ $comment->created_at->diffForHumans() }}</span>
                    <p class="font-weight-light">{{ $comment->comment }}</p>
                    <a href="#!" class="badge badge-pill badge-primary font-weight-light"><i class="fa fa-reply" aria-hidden="true"></i> {{ __('btn.reply') }}</a>

                    @if($comment->comment_son->count() > 0)
                        <a href="#!" class="badge badge-pill badge-warning font-weight-light open-reply" data-comment-hidden="{{ $comment->id }}"><i class="fa fa-comments" aria-hidden="true"></i> {{ trans_choice('btn.comment', $comment->comment_son->count(), ['num' => $comment->comment_son->count()]) }}</a>
                    @endif

                    @if($comment->wasCreatedBy(Auth::user()))
                        <a href="#!" class="badge badge-pill badge-danger font-weight-light float-right" style="margin-left: 10px;">{{ __('btn.delete') }}</a>
                        <a href="#!" class="badge badge-pill badge-info font-weight-light float-right">{{ __('btn.modify') }}</a>
                    @endif
                </div>
            </div>
        </div>
        <div class="w-100"></div>
        {{--@foreach($comment->comment_son as $comment)
            <div class="col-md-2 col-lg-1 d-none d-md-block comment-hidden-{{ $comment->padre_id }}">
                <img data-src="holder.js/75x75" class="rounded comment-hidden-{{ $comment->padre_id }}" alt="75x75"
                     src="{{ Avatar::create($comment->user->name)->toBase64() }}"
                     data-holder-rendered="true" style="width: 75px; height: 75px;">
            </div>
            <div class="col col-md-10 comment-hidden-{{ $comment->padre_id }}" style="padding-left: 0;">
                <div class="jumbotron jumbotron-fluid p-2 rounded" style="margin-bottom: 5px;">
                    <div class="container">
                        <span class="lead font-weight-light">
                            {{ $comment->user->name }}
                            @if($comment->updated_at > $comment->created_at)
                                <smal><a href="#!" class="badge badge-pill badge-dark font-weight-light" style="font-size: .65em;">Mod</a></smal>
                            @endif
                        </span>
                        <span class="float-right d-none d-sm-block">{{ $comment->created_at->diffForHumans() }}</span>
                        <p class="font-weight-light">{{ $comment->comment }}</p>
                    </div>
                </div>
            </div>
            <div class="w-100"></div>
        @endforeach--}}
    @endforeach

@else
    @guest
        <p class="text-muted">{{ __(':name be the first to make a comment', ['name' =>  '']) }}</p>
    @else
        <p class="text-muted">{{ __(':name be the first to make a comment', ['name' =>  Auth::user()->name]) }}</p>
    @endguest
@endif