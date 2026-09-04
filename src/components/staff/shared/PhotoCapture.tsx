import { useRef, useState, useCallback } from 'react';
import { Camera, Upload, X, RotateCcw } from 'lucide-react';

interface Props {
  onPhoto: (base64: string) => void;
  preview?: string;
  allowGallery?: boolean;
}

// Compress image to < 500KB using canvas
async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 1024;
        let { width, height } = img;
        if (width > MAX || height > MAX) {
          if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
          else { width = Math.round(width * MAX / height); height = MAX; }
        }
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        let quality = 0.8;
        let result = canvas.toDataURL('image/jpeg', quality);
        // Reduce quality until < 500KB
        while (result.length > 500000 && quality > 0.3) {
          quality -= 0.1;
          result = canvas.toDataURL('image/jpeg', quality);
        }
        resolve(result);
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function PhotoCapture({ onPhoto, preview, allowGallery = true }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = useCallback(async (file: File | null) => {
    if (!file) return;
    setError('');
    const allowed = ['image/jpeg','image/jpg','image/png','image/webp','image/heic'];
    if (!allowed.includes(file.type.toLowerCase())) {
      setError('Only JPG, PNG, WEBP, or HEIC files are allowed.'); return;
    }
    setLoading(true);
    try {
      const compressed = await compressImage(file);
      onPhoto(compressed);
    } catch { setError('Failed to process image. Please try again.'); }
    setLoading(false);
  }, [onPhoto]);

  if (preview) {
    return (
      <div style={{ position:'relative', borderRadius:12, overflow:'hidden', border:'2px solid #16a34a', background:'#f0fdf4' }}>
        <img src={preview} alt="Attendance" style={{ width:'100%', height:200, objectFit:'cover', display:'block' }}/>
        <button onClick={() => onPhoto('')}
          style={{ position:'absolute', top:8, right:8, width:28, height:28, borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:'none', cursor:'pointer', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={14}/>
        </button>
        <div style={{ position:'absolute', bottom:0, left:0, right:0, background:'linear-gradient(to top, rgba(0,0,0,0.5), transparent)', padding:'20px 12px 10px', color:'#fff' }}>
          <p style={{ fontSize:11, fontWeight:600 }}>✓ Photo captured</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ border:'2px dashed #e8e2da', borderRadius:12, padding:'24px 16px', textAlign:'center', background:'#faf9f7' }}>
        {loading ? (
          <div style={{ color:'#78716c' }}>
            <div style={{ width:32, height:32, border:'3px solid #e8e2da', borderTopColor:'#1b4332', borderRadius:'50%', animation:'spin 0.8s linear infinite', margin:'0 auto 10px' }}/>
            <p style={{ fontSize:13 }}>Processing photo…</p>
          </div>
        ) : (
          <>
            <div style={{ width:48, height:48, borderRadius:'50%', background:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 14px' }}>
              <Camera size={22} color="#16a34a"/>
            </div>
            <p style={{ fontSize:14, fontWeight:600, color:'#1c1917', marginBottom:4 }}>Add Attendance Photo</p>
            <p style={{ fontSize:12, color:'#78716c', marginBottom:16 }}>Required — take a selfie or upload a photo</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
              <button onClick={() => cameraRef.current?.click()}
                style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:8, border:'none', cursor:'pointer', background:'#1b4332', color:'#fff', fontSize:13, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
                <Camera size={16}/> Take Photo
              </button>
              {allowGallery && (
                <button onClick={() => fileRef.current?.click()}
                  style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 18px', borderRadius:8, border:'1.5px solid #e8e2da', cursor:'pointer', background:'#fff', color:'#57534e', fontSize:13, fontWeight:600, fontFamily:'Inter,sans-serif' }}>
                  <Upload size={16}/> Upload Photo
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {error && <p style={{ color:'#dc2626', fontSize:12, marginTop:8 }}>{error}</p>}

      {/* Camera input — opens camera directly on mobile */}
      <input ref={cameraRef} type="file" accept="image/*" capture="user" style={{ display:'none' }} onChange={e => handleFile(e.target.files?.[0] || null)} />
      {/* Gallery input */}
      <input ref={fileRef} type="file" accept="image/*,image/heic" style={{ display:'none' }} onChange={e => handleFile(e.target.files?.[0] || null)} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
