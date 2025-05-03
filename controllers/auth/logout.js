export const logout = (req, res) => {
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict',
        path: '/',
    });
    
    res.status(200).json({ message: 'Logged out successfully' });
}