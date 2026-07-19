const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/",
    });

    console.log("SignIn result:", result); // ← أضف هذا

    if (result?.error) {
      setError("بيانات الدخول غير صحيحة");
    } else if (result?.ok) {
      router.push("/");
      router.refresh();
    }
  } catch (err) {
    console.error("SignIn error:", err); // ← أضف هذا
    setError("حدث خطأ غير متوقع");
  } finally {
    setLoading(false);
  }
};