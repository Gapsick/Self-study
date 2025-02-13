session_start();
?>
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>게시판</title>
</head>
<body>
    <h2>게시판</h2>

    <?php if (isset($_SESSION['user_id'])): ?>
        <p>환영합니다, <?php echo $_SESSION['nickname']; ?>님!</p>
        <a href="logout.php">로그아웃</a>
        <br><br>
        <a href="write.php">글쓰기</a>  <!-- 로그인한 사용자만 글 작성 가능 -->
    <?php else: ?>
        <p><a href="login.php">로그인</a> 후 글을 작성할 수 있습니다.</p>
    <?php endif; ?>

    <hr>

    <!-- 게시글 목록 -->
    <?php
    $conn = new mysqli("localhost", "root", "password", "database");
    $sql = "SELECT * FROM posts ORDER BY created_at DESC";
    $result = $conn->query($sql);

    while ($row = $result->fetch_assoc()) {
        echo "<h3><a href='post.php?id=" . $row['id'] . "'>" . $row['title'] . "</a></h3>";
        echo "<p>" . $row['content'] . "</p><hr>";
    }
    ?>
</body>
</html>
