Socket.on("entry_photo", async (data) => {
    const { car_number, image } = data
    if (!car_number || !image) return;

    try {
        const fileName = `${Date.now()}_${car_number}.jpg`;
        const uploadDir = path.join(process.cwd(), "uploads/cars");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
        const filePath = path.join(uploadDir, fileName);

        fs.writeFileSync(filePath, Buffer.from(image.replace(/^data:image\/\w+;base64,/, ""), "base64"));

        await pool.query(
            `UPDATE parking_event 
            SET entry_photo_url=? 
            WHERE plate_number=? AND exit_time IS NULL
            ORDER BY id DESC LIMIT 1`,
            [`/uploads/cars/${fileName}`, car_number]
        );

        console.log(`[입구 사진 저장 완료] ${car_number}`);
    } catch (err) {
        console.error("사진 저장 오류:", err.message);
    }
})