import inspect
import torch
import torch.nn as nn
import torch.nn.functional as F
import json
#from config import LOGGER
from typing import get_type_hints

def get_class_info(cls):
    init_sig = inspect.signature(cls.__init__)
    forward_sig = inspect.signature(cls.forward)

    init_args = []
    for name, param in init_sig.parameters.items():
        if name == 'self':
            continue
        type_hints = get_type_hints(cls.__init__.__init__)
        arg_type = type_hints.get(name, "Any")
        arg_type_str = arg_type.__name__ if hasattr(arg_type, "__name__") else str(arg_type)

        init_args.append(
            {"name": name, "type": arg_type_str ,"default": param.default if param.default is not inspect.Parameter.empty else None}
            )
        
    forward_args = [
        {"name": name, "default": param.default if param.default is not inspect.Parameter.empty else None}
        for name, param in forward_sig.parameters.items()
        if name != 'self'
    ]

    return {"init_args": init_args, "forward_args": forward_args, "doc": cls.__doc__}

MANUAL_FUNCTIONS_SIGNATURES = {
    torch.cat: [
        {"name": "tensors", "default": None},
        {"name": "dim", "default": None},
        {"name": "out", "default": None}
    ],
    torch.stack: [
        {"name": "tensors", "default": None},
        {"name": "dim", "default": 0},
        {"name": "out", "default": None}
    ],
    torch.add: [
        {"name": "input", "default": None},
        {"name": "other", "default": None},
        {"name": "alpha", "default": 1}
    ]
}

def get_function_info(fn):
    try:
        sig = inspect.signature(fn)
        return [
            {
                "name": name,
                "default": param.default if param.default is not inspect.Parameter.empty else None
            }
            for name, param in sig.parameters.items()
        ]
    except (ValueError, TypeError):
        if fn in MANUAL_FUNCTIONS_SIGNATURES:
            try:
                MANUAL_FUNCTIONS_SIGNATURES['doc'] = fn.__doc__
            except:
                pass
            return MANUAL_FUNCTIONS_SIGNATURES[fn]
        
        #LOGGER.error(str(fn) + " is unknowed.")

def get_block_json(block):
    if inspect.isclass(block):
        return get_class_info(block)
    elif inspect.isroutine(block):
        return get_function_info(block)
    #LOGGER.warn(str(block) + " is not a callable function or a class.")


BUILDER_MODULES = {
    "BatchNorm2d": get_block_json(nn.BatchNorm2d),
    "Conv2d": get_block_json(nn.Conv2d),
    "Dropout2d": get_block_json(nn.Dropout2d),
}

BUILDER_ACTIVATION_FUNCTIONS = {
    "ReLU": get_block_json(nn.ReLU),
    "SiLU": get_block_json(nn.SiLU),
    "Sigmoid": get_block_json(nn.Sigmoid),
}

BUILDER_FUNCTIONS = {
    "concatenate": get_block_json(torch.cat),
    "add": get_block_json(torch.add),
    "stack": get_block_json(torch.stack),
}

BLOCKS = {
    "operations":{"blocks": BUILDER_FUNCTIONS, "color": "tensorops"},
    "activation": {"blocks":BUILDER_ACTIVATION_FUNCTIONS, "color": "activation"},
    "modules": {"blocks":BUILDER_MODULES, "color": "components"},
}