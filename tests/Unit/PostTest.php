<?php

namespace Tests\Unit;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PostTest extends TestCase
{
    use DatabaseMigrations;
    /** @test */

    public function post_determines_its_author()
    {
        // Arrange
        $user = factory(\App\User::class)->create();
        $post = factory(\App\Post::class)->create(['user_id' => $user->id]);
        $post2 = factory(\App\Post::class)->create();

        // Act
        $result = $post->wasCreatedBy($user);
        $result2 = $post2->wasCreatedBy($user);
        $result3 = $post2->wasCreatedBy(null);

        // Assert
        $result = $this->assertTrue($result);
        $result2 = $this->assertFalse($result2);
        $result3 = $this->assertFalse($result3);

    }
}
