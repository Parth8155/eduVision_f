import { useCallback } from 'react';
import ReactPDFViewerNew from './ReactPDFViewerNew';

const ContentView = ({
    pdfUrl,
    onLoadSuccess,
    onLoadError,
    editingCommand,
    onTextSelection,
    onCreateNumberAnnotation,
    onCommandProcessed,
    noteId,
    onSaveFunction,
    onAnnotationsChange,
    onUnsavedChanges
}) => {
    // Memoize the text selection handler to prevent re-renders
    const handleTextSelection = useCallback((selection) => {
        if (onTextSelection) {
            onTextSelection(selection);
        }
    }, [onTextSelection]);

    if (pdfUrl) {
        return (
            <div className="h-full bg-white overflow-hidden">
                <ReactPDFViewerNew
                    pdfUrl={pdfUrl}
                    className="h-full w-full"
                    onLoadSuccess={onLoadSuccess}
                    onLoadError={onLoadError}
                    editingCommand={editingCommand}
                    onTextSelection={handleTextSelection}
                    onCreateNumberAnnotation={onCreateNumberAnnotation}
                    onCommandProcessed={onCommandProcessed}
                    noteId={noteId}
                    onSaveFunction={onSaveFunction}
                    onAnnotationsChange={onAnnotationsChange}
                    onUnsavedChanges={onUnsavedChanges}
                />
            </div>
        );
    }

    return (
        <div className="h-full overflow-auto">
            <div className="max-w-4xl mx-auto p-8">
                <h1 className="text-4xl font-light text-center mb-12 text-black">Heart Valves</h1>

                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <img
                            src="/lovable-uploads/0201e877-d88f-4b69-8bda-71fe2468a57f.png"
                            alt="Heart anatomy diagram showing valves, arteries and veins"
                            className="max-w-md h-auto"
                        />
                    </div>
                </div>

                <div className="text-center mb-12">
                    <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        The heart, showing valves, arteries and veins. <span className="text-gray-800">The white arrows shows the normal direction of blood flow.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContentView;
